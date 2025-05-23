const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const { xss } = require('express-xss-sanitizer');

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// API specific rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many API requests from this IP, please try again after 15 minutes'
});

// Configure security middleware
const configureSecurityMiddleware = (app) => {
  // Basic security headers
  app.use(helmet());

  // Rate limiting
  app.use(limiter);
  app.use('/api/', apiLimiter);

  // Prevent HTTP Parameter Pollution
  app.use(hpp());

  // XSS Protection
  app.use(xss());

  // CORS is now handled in server.js
  // Security-related headers only in this middleware

  // Security response headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
};

module.exports = configureSecurityMiddleware;
