const express = require('express');
const router = express.Router();

// Simple test routes for now
router.post('/register', (req, res) => {
  console.log('Register attempt:', req.body);
  res.json({
    success: true,
    message: 'Registration endpoint working',
    user: { id: 1, username: req.body.username, email: req.body.email },
    token: 'fake-jwt-token-for-testing'
  });
});

router.post('/login', (req, res) => {
  console.log('Login attempt:', req.body);
  res.json({
    success: true,
    message: 'Login endpoint working',
    user: { id: 1, username: 'testuser', email: req.body.email },
    token: 'fake-jwt-token-for-testing'
  });
});

router.get('/verify', (req, res) => {
  res.json({
    success: true,
    message: 'Token verification working',
    user: { id: 1, username: 'testuser', email: 'test@example.com' }
  });
});

module.exports = router;
