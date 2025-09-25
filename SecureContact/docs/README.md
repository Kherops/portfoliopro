# SecureContact 🔒

A secure, self-hostable contact form solution designed for portfolio and professional websites. Built with modern web technologies and security best practices.

![SecureContact Banner](../screenshots/banner.png)

## ✨ Features

### 🛡️ Security First
- **XSS Protection**: All inputs are sanitized using `sanitize-html`
- **Rate Limiting**: IP-based rate limiting to prevent spam
- **Honeypot Field**: Invisible field to catch bots
- **reCAPTCHA Integration**: Optional Google reCAPTCHA v3 support
- **JWT Authentication**: Secure admin authentication
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Configurable CORS settings
- **Client-side Encryption**: Optional message encryption before transmission

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on all devices
- **Tailwind CSS**: Beautiful, modern styling
- **Loading States**: Smooth user feedback
- **Error Handling**: Clear error messages
- **Success Notifications**: Confirmation messages
- **Accessibility**: WCAG compliant

### 🚀 Admin Dashboard
- **Secure Login**: Password-protected admin access
- **Message Management**: View, read, and delete messages
- **Pagination**: Handle large volumes of messages
- **Real-time Updates**: Live message status
- **Export Functionality**: Download messages as CSV
- **IP Tracking**: Monitor message sources

## 🏗️ Architecture

```
SecureContact/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/           # Express.js API
│   ├── config/           # Database configuration
│   ├── middleware/       # Custom middleware
│   ├── server.js        # Main server file
│   └── package.json
├── database/          # Database schema
│   └── schema.sql       # PostgreSQL schema
└── docs/             # Documentation
    └── README.md        # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Vite** - Fast build tool
- **reCAPTCHA** - Bot protection
- **CryptoJS** - Client-side encryption

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Reliable database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate Limiting** - Spam protection

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd SecureContact

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb securecontact

# Run the schema
psql securecontact < ../database/schema.sql
```

### 3. Environment Configuration

**Backend (.env)**
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/securecontact

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_PASSWORD=your-secure-admin-password

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Optional: reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

**Frontend (.env)**
```bash
cd frontend
cp .env.example .env
```

Edit `.env` with your settings:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see your contact form!

## 📱 Screenshots

### Contact Form
![Contact Form](../screenshots/contact-form.png)

### Admin Login
![Admin Login](../screenshots/admin-login.png)

### Admin Dashboard
![Admin Dashboard](../screenshots/admin-dashboard.png)

## 🌐 Deployment

### Backend Deployment (Railway/Render)

1. **Railway.app**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Render.com**
   - Connect your GitHub repository
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables

### Frontend Deployment (Vercel/Netlify)

1. **Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   cd frontend
   vercel
   ```

2. **Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

### Database Options

- **Supabase** (Recommended)
- **Railway PostgreSQL**
- **Render PostgreSQL**
- **AWS RDS**
- **Google Cloud SQL**

## 🔧 Configuration

### Security Settings

```javascript
// Rate limiting
RATE_LIMIT_WINDOW_MS=60000  // 1 minute
RATE_LIMIT_MAX_REQUESTS=5   // 5 requests per minute

// JWT
JWT_EXPIRES_IN=24h          // Token expiration

// Password hashing
BCRYPT_ROUNDS=12            // Hash rounds
```

### reCAPTCHA Setup

1. Visit [Google reCAPTCHA](https://www.google.com/recaptcha/)
2. Create a new site (v3)
3. Add your domain
4. Copy site key to frontend `.env`
5. Copy secret key to backend `.env`

### CORS Configuration

```javascript
// Allow specific origins
FRONTEND_URL=https://yourdomain.com

// Multiple origins (comma-separated)
FRONTEND_URL=http://localhost:3000,https://yourdomain.com
```

## 🔒 Security Features

### Input Validation
- **Client-side**: React form validation
- **Server-side**: Yup schema validation
- **Sanitization**: HTML sanitization
- **Length limits**: Prevent oversized inputs

### Anti-Spam Protection
- **Rate limiting**: IP-based request limiting
- **Honeypot**: Hidden field to catch bots
- **reCAPTCHA**: Google's bot detection
- **IP tracking**: Monitor suspicious activity

### Authentication
- **JWT tokens**: Stateless authentication
- **Secure headers**: Helmet.js security headers
- **Password hashing**: bcrypt with salt rounds
- **Token expiration**: Automatic logout

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

## 📊 Monitoring

### Logs
- Request logging
- Error tracking
- Security events
- Performance metrics

### Analytics
- Message volume
- Response times
- Error rates
- Geographic data

## 🔧 Customization

### Styling
```css
/* Custom colors in tailwind.config.js */
colors: {
  primary: {
    500: '#your-color',
    600: '#your-darker-color',
  }
}
```

### Email Integration
```javascript
// Add to server.js
const nodemailer = require('nodemailer');

// Configure email notifications
const sendNotification = async (message) => {
  // Your email logic here
};
```

### Database Extensions
```sql
-- Add custom fields to messages table
ALTER TABLE messages ADD COLUMN phone VARCHAR(20);
ALTER TABLE messages ADD COLUMN company VARCHAR(100);
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL service
sudo service postgresql status

# Verify connection string
psql "postgresql://username:password@localhost:5432/securecontact"
```

**CORS Errors**
```javascript
// Update FRONTEND_URL in backend .env
FRONTEND_URL=http://localhost:3000
```

**reCAPTCHA Not Working**
```javascript
// Verify keys in .env files
// Check domain registration
// Test with localhost first
```

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development
DEBUG=securecontact:*
```

## 📈 Performance

### Optimization Tips
- Enable gzip compression
- Use CDN for static assets
- Implement database indexing
- Add Redis caching
- Optimize images

### Scaling
- Horizontal scaling with load balancers
- Database read replicas
- CDN integration
- Caching layers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow ESLint rules
- Write meaningful commit messages
- Add JSDoc comments
- Update documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@yourproject.com

## 🎯 Roadmap

### v1.1
- [ ] Email notifications
- [ ] Message export (CSV/JSON)
- [ ] Advanced spam filtering
- [ ] Multi-language support

### v1.2
- [ ] File attachments
- [ ] Custom fields
- [ ] Webhook integrations
- [ ] Analytics dashboard

### v2.0
- [ ] Multi-tenant support
- [ ] Advanced admin roles
- [ ] API rate limiting per user
- [ ] Real-time notifications

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for beautiful styling
- Express.js community
- PostgreSQL developers
- All contributors and users

---

**Made with ❤️ for secure communication**

*SecureContact - Because your privacy matters*
