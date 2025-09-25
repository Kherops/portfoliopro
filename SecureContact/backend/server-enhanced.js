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
const { checkIPBan, recordFailedAttempt, clearFailedAttempts } = require('./middleware/ipBanlist');
const { antivirusMiddleware } = require('./utils/antivirus');
const { encryptMessage, decryptMessage } = require('./utils/encryption');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// IP ban check middleware
app.use(checkIPBan);

// Antivirus scanning middleware
app.use(antivirusMiddleware);

// Rate limiting with different limits for different endpoints
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin endpoints if properly authenticated
    if (req.path.startsWith('/api/messages') && req.headers.authorization) {
      return true;
    }
    return false;
  }
});

// Different rate limits for different endpoints
const contactLimiter = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 3, // 3 requests per minute for contact
  'Too many contact form submissions, please try again later.'
);

const loginLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 login attempts per 15 minutes
  'Too many login attempts, please try again later.'
);

const generalLimiter = createRateLimit(
  60000, // 1 minute
  20, // 20 requests per minute for general endpoints
  'Too many requests, please try again later.'
);

// Apply rate limiting
app.use('/api/contact', contactLimiter);
app.use('/api/login', loginLimiter);
app.use('/api', generalLimiter);

// Contact form validation schema
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
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    features: {
      antivirus: true,
      encryption: !!process.env.ENCRYPTION_KEY,
      recaptcha: !!process.env.RECAPTCHA_SECRET_KEY,
      ipBanlist: true
    }
  });
});

// Contact form submission with enhanced security
app.post('/api/contact', async (req, res) => {
  try {
    // Validate input
    await contactSchema.validate(req.body);
    
    const { name, email, message, _honey, recaptchaToken } = req.body;
    
    // Honeypot check
    if (_honey && _honey.trim() !== '') {
      console.log('Bot detected via honeypot:', req.ip);
      await recordFailedAttempt(req, 'honeypot');
      return res.status(400).json({ error: 'Invalid submission' });
    }
    
    // Verify reCAPTCHA
    if (process.env.RECAPTCHA_SECRET_KEY) {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidRecaptcha) {
        await recordFailedAttempt(req, 'recaptcha');
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
    
    // Get client IP and user agent
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    // Handle encryption if enabled
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const messageData = encryptMessage(sanitizedMessage, encryptionKey);
    
    // Check if message was quarantined by antivirus
    const isQuarantined = req.body._quarantined || false;
    const scanResult = req.body._scanResult || null;
    
    // Save to database with additional metadata
    const query = `
      INSERT INTO messages (name, email, message, ip_address, user_agent, created_at, is_encrypted, is_quarantined, scan_result)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8)
      RETURNING id, created_at
    `;
    
    const result = await db.query(query, [
      sanitizedName, 
      sanitizedEmail, 
      JSON.stringify(messageData), 
      clientIP,
      userAgent,
      messageData.encrypted,
      isQuarantined,
      scanResult ? JSON.stringify(scanResult) : null
    ]);
    
    // Clear failed attempts on successful submission
    clearFailedAttempts(req);
    
    console.log(`✅ New message received from ${sanitizedEmail} (IP: ${clientIP})${isQuarantined ? ' [QUARANTINED]' : ''}`);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      id: result.rows[0].id,
      timestamp: result.rows[0].created_at,
      encrypted: messageData.encrypted
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login with enhanced security
app.post('/api/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      await recordFailedAttempt(req, 'login');
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Compare with admin password
    const isValidPassword = await bcrypt.compare(password, await bcrypt.hash(process.env.ADMIN_PASSWORD, 12));
    
    if (!isValidPassword) {
      console.log('Failed login attempt from IP:', req.ip);
      await recordFailedAttempt(req, 'login');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Clear failed attempts on successful login
    clearFailedAttempts(req);
    
    // Generate JWT token with additional claims
    const token = jwt.sign(
      { 
        role: 'admin', 
        ip: req.ip,
        loginTime: new Date().toISOString(),
        features: ['read_messages', 'delete_messages']
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    console.log('✅ Admin login successful from IP:', req.ip);
    
    res.json({
      success: true,
      token,
      message: 'Login successful',
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get messages with enhanced features (protected route)
app.get('/api/messages', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const showQuarantined = req.query.quarantined === 'true';
    
    // Build query conditions
    let whereClause = '';
    let queryParams = [limit, offset];
    
    if (showQuarantined) {
      whereClause = 'WHERE is_quarantined = true';
    } else if (req.query.quarantined === 'false') {
      whereClause = 'WHERE is_quarantined = false';
    }
    
    // Get total count
    const countQuery = `SELECT COUNT(*) FROM messages ${whereClause}`;
    const countResult = await db.query(countQuery);
    const totalMessages = parseInt(countResult.rows[0].count);
    
    // Get messages with pagination
    const messagesQuery = `
      SELECT id, name, email, message, ip_address, user_agent, created_at, is_encrypted, is_quarantined, scan_result
      FROM messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const messagesResult = await db.query(messagesQuery, queryParams);
    
    // Decrypt messages if needed
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const processedMessages = messagesResult.rows.map(msg => {
      let processedMessage = msg.message;
      
      // Handle encrypted messages
      if (msg.is_encrypted && encryptionKey) {
        try {
          const messageData = JSON.parse(msg.message);
          processedMessage = decryptMessage(messageData, encryptionKey);
        } catch (error) {
          console.error('Failed to decrypt message:', error);
          processedMessage = '[ENCRYPTED - DECRYPTION FAILED]';
        }
      } else if (typeof msg.message === 'string' && msg.message.startsWith('{')) {
        try {
          const messageData = JSON.parse(msg.message);
          processedMessage = messageData.message || msg.message;
        } catch (error) {
          // Not JSON, use as is
        }
      }
      
      return {
        ...msg,
        message: processedMessage,
        scan_result: msg.scan_result ? JSON.parse(msg.scan_result) : null
      };
    });
    
    res.json({
      success: true,
      messages: processedMessages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalMessages / limit),
        totalMessages,
        limit
      },
      filters: {
        showQuarantined,
        encryptionEnabled: !!encryptionKey
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
    
    console.log(`🗑️ Message ${id} deleted by admin from IP:`, req.ip);
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get security statistics (protected route)
app.get('/api/security/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await db.query(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE is_quarantined = true) as quarantined_messages,
        COUNT(*) FILTER (WHERE is_encrypted = true) as encrypted_messages,
        COUNT(DISTINCT ip_address) as unique_ips,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as messages_24h,
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as messages_7d
      FROM messages
    `);
    
    const banStats = await db.query(`
      SELECT 
        COUNT(*) as total_bans,
        COUNT(*) FILTER (WHERE is_active = true) as active_bans,
        COUNT(*) FILTER (WHERE expires_at > NOW()) as temporary_bans
      FROM ip_banlist
    `);
    
    res.json({
      success: true,
      stats: {
        messages: stats.rows[0],
        bans: banStats.rows[0],
        features: {
          encryption: !!process.env.ENCRYPTION_KEY,
          recaptcha: !!process.env.RECAPTCHA_SECRET_KEY,
          antivirus: true,
          ipBanlist: true
        }
      }
    });
    
  } catch (error) {
    console.error('Security stats error:', error);
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

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SecureContact API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🛡️ Security features enabled:`);
  console.log(`   - IP Banlist: ✅`);
  console.log(`   - Antivirus Scanning: ✅`);
  console.log(`   - Message Encryption: ${process.env.ENCRYPTION_KEY ? '✅' : '❌'}`);
  console.log(`   - reCAPTCHA: ${process.env.RECAPTCHA_SECRET_KEY ? '✅' : '❌'}`);
});

module.exports = app;
