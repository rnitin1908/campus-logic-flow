const express = require('express');
// const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


// MongoDB connection
require('dotenv').config({ path: path.join(__dirname, '.env') });
const configureSecurityMiddleware = require('./middleware/security');
const { connectToDatabase } = require('./config/database/mongodb');

// Import routes
const authRoutes = require('./mongodb/routes/authRoutes');
const studentRoutes = require('./mongodb/routes/studentRoutes');
const schoolRoutes = require('./mongodb/routes/schoolRoutes');
const classRoutes = require('./mongodb/routes/classRoutes');
const subjectRoutes = require('./mongodb/routes/subjectRoutes');
const tenantRoutes = require('./mongodb/routes/tenantRoutes');

// Load env vars
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log(process.env.MONGO_URI);

// Init express app
const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS for all routes - this needs to be before other middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean); // Remove any undefined/null values
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // For development, allow all origins
      callback(null, true);
      // In production, you might want to restrict: 
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Role', 'X-Requested-With']
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Configure security middleware (includes helmet, rate limiting, etc.)
configureSecurityMiddleware(app);

// Simple middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Custom middleware for role-based access control
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // In a real app, you would extract the role from a JWT token
    // For Supabase, this would be handled by Supabase's RLS policies
    const userRole = req.headers['x-user-role'];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied: Insufficient permissions'
      });
    }
    
    next();
  };
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/tenants', tenantRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('School ERP API is running with MongoDB...');
});

// Info about the API and available routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the School ERP API',
    database: 'This application uses MongoDB for data storage.',
    auth: 'JWT-based authentication is implemented for secure access.'
  });
});

// API routes
app.get('/api/system/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), database: 'MongoDB' });
});

// Example route with role-based access
app.get('/api/admin/stats', checkRole(['super_admin', 'school_admin']), (req, res) => {
  res.json({
    message: 'Admin statistics would be returned here',
    note: 'This data comes from MongoDB.'
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
