const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  removeFollower,
  getFollowerStats
} = require('../controllers/followerController');

// All follower routes require authentication
router.use(authMiddleware);

// Get user's followers
router.get('/', getFollowers);

// Get users that current user is following
router.get('/following', getFollowing);

// Get follower statistics
router.get('/stats', getFollowerStats);

// Follow a user
router.post('/follow', followUser);

// Unfollow a user
router.delete('/unfollow/:userId', unfollowUser);

// Remove a follower
router.delete('/remove/:userId', removeFollower);

module.exports = router;