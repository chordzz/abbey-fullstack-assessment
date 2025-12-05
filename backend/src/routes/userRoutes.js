

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById
} = require('../controllers/userController');

// All user routes require authentication
router.use(authMiddleware);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Get all users (Explore page)
router.get('/all', getAllUsers);

// Get specific user by ID
router.get('/:id', getUserById);

module.exports = router;