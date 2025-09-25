const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');
const validator = require('validator');
const yup = require('yup');
require('dotenv').config();

const db = require('./config/database');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// // Contact form validation schema
// const contactSchema = yup.object().shape({
//   name: yup.string().required('Name is required').min(2).max(100),
//   email: yup.string().email('Invalid email').required('Email is required'),
//   message: yup.string().required('Message is required').min(10).max(1000),
//   _honey: yup.string().max(0, 'Bot detected'), // Honeypot field
//   recaptchaToken: yup.string().optional()
// });

// Verify reCAPTCHA token
async function verifyRecaptcha(token) {
  if (!process.env.RECAPTCHA_SECRET_KEY || !token) {
    return true; // Skip verification if not configured
  }
  
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    
    const data = await response.json();
    return data.success && data.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Contact form submission
app.post('/api/contact', limiter, async (req, res) => {
  try {
    // Validate input
    await contactSchema.validate(req.body);
    
    const { name, email, message, _honey, recaptchaToken } = req.body;
    
    // Honeypot check
    if (_honey && _honey.trim() !== '') {
      console.log('Bot detected via honeypot:', req.ip);
      return res.status(400).json({ error: 'Invalid submission' });
    }
    
    // Verify reCAPTCHA
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        return res.status(400).json({ error: 'reCAPTCHA verification failed' });
      }
    }
    
    // Sanitize input
    const sanitizedName = sanitizeHtml(name.trim(), { allowedTags: [], allowedAttributes: {} });
    const sanitizedEmail = validator.normalizeEmail(email.trim());
    const sanitizedMessage = sanitizeHtml(message.trim(), { allowedTags: [], allowedAttributes: {} });
    
    // Additional validation
    if (!validator.isEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Get client IP
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    
    // Save to database
    const query = `
      INSERT INTO messages (name, email, message, ip_address, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, created_at
    `;
    
    const result = await db.query(query, [sanitizedName, sanitizedEmail, sanitizedMessage, clientIP]);
    
    console.log(`New message received from ${sanitizedEmail} (IP: ${clientIP})`);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: result.rows[0].id,
      timestamp: result.rows[0].created_at
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Compare with admin password
    const isValidPassword = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 12));
    
    if (!isValidPassword) {
      console.log('Failed login attempt from IP:', req.ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin', ip: req.ip },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    console.log('Admin login successful from IP:', req.ip);
    
    res.json({
      success: true,
      token,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages (protected route)
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM messages';
    const countResult = await db.query(countQuery);
    const totalMessages = parseInt(countResult.rows[0].count);
    
    // Get messages with pagination
    const messagesQuery = `
      SELECT id, name, email, message, ip_address, created_at
      FROM messages
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const messagesResult = await db.query(messagesQuery, [limit, offset]);
    
    res.json({
      success: true,
      messages: messagesResult.rows,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        limit
      }
    });
    
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete message (protected route)
app.delete('/api/messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!validator.isUUID(id)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }
    
    const query = 'DELETE FROM messages WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    console.log(`Message ${id} deleted by admin from IP:`, req.ip);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SecureContact API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
