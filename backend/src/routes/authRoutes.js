const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { 
  signup, 
  signin, 
  getMe, 
  logout 
} = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/signin', signin);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.post('/logout', authMiddleware, logout);

module.exports = router;