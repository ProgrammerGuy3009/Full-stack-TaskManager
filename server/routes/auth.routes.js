const express = require('express');
const router = express.Router();
const { register, login, verifyToken, getProfile, logout } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware'); // If you have this

// Registration & Login (Public)
router.post('/register', register);
router.post('/login', login);

// JWT Protected routes
router.get('/verify', authMiddleware, verifyToken);    // optional: with middleware for verifying JWT
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', logout);

module.exports = router;
