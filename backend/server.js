const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const configureSecurityMiddleware = require('./middleware/security');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json({ limit: '10kb' }));

// Configure security middleware (includes CORS, helmet, rate limiting, etc.)
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

// Basic route
app.get('/', (req, res) => {
  res.send('ERP API is running...');
});

// Info about the API and available routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the School ERP API',
    supabase: 'This application now uses Supabase for authentication and data storage.',
    info: 'The Express backend is kept as a fallback or for custom business logic that cannot be handled by Supabase.'
  });
});

// API routes (these would be placeholders for custom business logic)
app.get('/api/system/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Example route with role-based access
app.get('/api/admin/stats', checkRole(['super_admin', 'school_admin']), (req, res) => {
  res.json({
    message: 'Admin statistics would be returned here',
    note: 'This is a placeholder. In a real app, this data would come from Supabase.'
  });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
