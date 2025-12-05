

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getFriends,
  getFriendRequests,
  getSentRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend
} = require('../controllers/friendController');

// All friend routes require authentication
router.use(authMiddleware);

// Get friends list
router.get('/', getFriends);

// Get friend requests (received)
router.get('/requests', getFriendRequests);

// Get sent friend requests
router.get('/requests/sent', getSentRequests);

// Send friend request
router.post('/request', sendFriendRequest);

// Accept friend request
router.patch('/accept/:friendshipId', acceptFriendRequest);

// Reject friend request
router.patch('/reject/:friendshipId', rejectFriendRequest);

// Cancel friend request (that you sent)
router.delete('/cancel/:friendshipId', cancelFriendRequest);

// Remove friend (unfriend)
router.delete('/:friendId', removeFriend);

module.exports = router;