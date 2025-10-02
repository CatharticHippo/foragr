const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Cedarlume Marketplace API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API endpoints
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Welcome to Cedarlume Marketplace API',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      users: '/api/users/*',
      organizations: '/api/organizations/*',
      listings: '/api/listings/*'
    }
  });
});

// Auth endpoints (mock)
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint ready (mock)',
    user: { id: '1', email: req.body.email || 'demo@example.com' },
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration endpoint ready (mock)',
    user: { id: '1', email: req.body.email || 'demo@example.com' }
  });
});

// Users endpoints (mock)
app.get('/api/users/me', (req, res) => {
  res.json({
    id: '1',
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    isVerified: true
  });
});

// Organizations endpoints (mock)
app.get('/api/organizations', (req, res) => {
  res.json({
    organizations: [
      {
        id: '1',
        name: 'Demo Nonprofit',
        description: 'A sample nonprofit organization',
        status: 'approved',
        location: 'San Francisco, CA'
      }
    ]
  });
});

// Listings endpoints (mock)
app.get('/api/listings', (req, res) => {
  res.json({
    listings: [
      {
        id: '1',
        title: 'Community Garden Volunteer',
        description: 'Help maintain our community garden',
        organizationId: '1',
        type: 'volunteer_shift',
        status: 'active',
        location: 'San Francisco, CA'
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Cedarlume Marketplace API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api`);
});

module.exports = app;
