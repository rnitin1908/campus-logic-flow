
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Simple middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
