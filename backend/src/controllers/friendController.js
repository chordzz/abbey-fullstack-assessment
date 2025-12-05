const pool = require('../config/database');

// UUID validation helper
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// @desc    Get user's friends list (accepted only)
// @route   GET /api/friends
// @access  Private
const getFriends = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        u.id, 
        u.email, 
        u.name, 
        u.bio, 
        u.avatar_url,
        u.created_at,
        (SELECT COUNT(*) FROM friendships 
         WHERE (user_id = u.id OR friend_id = u.id) 
         AND status = 'accepted') as friends_count,
        (SELECT COUNT(*) FROM followers 
         WHERE following_id = u.id) as followers_count,
        f.created_at as friendship_date
       FROM users u
       INNER JOIN friendships f ON (
         (f.user_id = $1 AND f.friend_id = u.id) OR 
         (f.friend_id = $1 AND f.user_id = u.id)
       )
       WHERE f.status = 'accepted'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      friends: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Server error fetching friends' });
  }
};

// @desc    Get pending friend requests (received by user)
// @route   GET /api/friends/requests
// @access  Private
const getFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;

    // Get requests where user is the recipient
    const result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.bio,
        u.avatar_url,
        f.id as friendship_id,
        f.created_at as request_date,
        (SELECT COUNT(*) FROM friendships 
         WHERE (user_id = u.id OR friend_id = u.id) 
         AND status = 'accepted') as friends_count,
        (SELECT COUNT(*) FROM followers 
         WHERE following_id = u.id) as followers_count
       FROM users u
       INNER JOIN friendships f ON f.requester_id = u.id
       WHERE (f.user_id = $1 OR f.friend_id = $1)
       AND f.requester_id != $1
       AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      requests: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({ error: 'Server error fetching friend requests' });
  }
};

// @desc    Get sent friend requests (pending requests sent by user)
// @route   GET /api/friends/requests/sent
// @access  Private
const getSentRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        u.id,
        u.email,
        u.name,
        u.bio,
        u.avatar_url,
        f.id as friendship_id,
        f.created_at as request_date
       FROM friendships f
       INNER JOIN users u ON (
         CASE 
           WHEN f.user_id = $1 THEN u.id = f.friend_id
           ELSE u.id = f.user_id
         END
       )
       WHERE f.requester_id = $1
       AND f.status = 'pending'
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      sentRequests: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({ error: 'Server error fetching sent requests' });
  }
};

// @desc    Send friend request
// @route   POST /api/friends/request
// @access  Private
const sendFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.body;

    // Validation
    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    if (!isValidUUID(friendId)) {
      return res.status(400).json({ error: 'Invalid friend ID format' });
    }

    if (friendId === userId) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }

    // Check if friend exists
    const friendExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [friendId]
    );

    if (friendExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if friendship already exists (in any direction)
    const existingFriendship = await pool.query(
      `SELECT id, status, requester_id FROM friendships 
       WHERE (user_id = $1 AND friend_id = $2) 
       OR (user_id = $2 AND friend_id = $1)`,
      [userId, friendId]
    );

    if (existingFriendship.rows.length > 0) {
      const friendship = existingFriendship.rows[0];
      
      if (friendship.status === 'accepted') {
        return res.status(400).json({ error: 'You are already friends' });
      }
      
      if (friendship.status === 'pending') {
        return res.status(400).json({ error: 'Friend request already sent' });
      }
      
      // If rejected, allow sending new request by updating
      if (friendship.status === 'rejected') {
        const result = await pool.query(
          `UPDATE friendships 
           SET status = 'pending', requester_id = $1, updated_at = NOW()
           WHERE id = $2
           RETURNING id`,
          [userId, friendship.id]
        );
        
        return res.json({ 
          message: 'Friend request sent successfully',
          friendshipId: result.rows[0].id
        });
      }
    }

    // Create new friendship request
    const result = await pool.query(
      `INSERT INTO friendships (user_id, friend_id, status, requester_id, created_at, updated_at)
       VALUES ($1, $2, 'pending', $1, NOW(), NOW())
       RETURNING id`,
      [userId, friendId]
    );

    res.status(201).json({
      message: 'Friend request sent successfully',
      friendshipId: result.rows[0].id
    });

  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Server error sending friend request' });
  }
};

// @desc    Accept friend request
// @route   PUT /api/friends/accept/:friendshipId
// @access  Private
const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendshipId } = req.params;

    // Validate friendshipId
    if (!friendshipId) {
      return res.status(400).json({ error: 'Invalid friendship ID' });
    }

    // Check if friendship exists and user is the recipient
    const friendship = await pool.query(
      `SELECT id, user_id, friend_id, status, requester_id 
       FROM friendships 
       WHERE id = $1`,
      [friendshipId]
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const friendshipData = friendship.rows[0];

    // Check if user is the recipient (not the requester)
    if (friendshipData.requester_id === userId) {
      return res.status(403).json({ error: 'Cannot accept your own friend request' });
    }

    // Check if user is part of this friendship
    if (friendshipData.user_id !== userId && friendshipData.friend_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to accept this request' });
    }

    // Check if already accepted
    if (friendshipData.status === 'accepted') {
      return res.status(400).json({ error: 'Friend request already accepted' });
    }

    // Check if pending
    if (friendshipData.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request is not pending' });
    }

    // Accept the request
    await pool.query(
      `UPDATE friendships 
       SET status = 'accepted', updated_at = NOW()
       WHERE id = $1`,
      [friendshipId]
    );

    res.json({
      message: 'Friend request accepted successfully'
    });

  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Server error accepting friend request' });
  }
};

// @desc    Reject friend request
// @route   PUT /api/friends/reject/:friendshipId
// @access  Private
const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendshipId } = req.params;

    // Validate friendshipId
    if (!friendshipId || !isValidUUID(friendshipId)) {
      return res.status(400).json({ error: 'Invalid friendship ID format' });
    }

    // Check if friendship exists and user is the recipient
    const friendship = await pool.query(
      `SELECT id, user_id, friend_id, status, requester_id 
       FROM friendships 
       WHERE id = $1`,
      [friendshipId]
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const friendshipData = friendship.rows[0];

    // Check if user is the recipient (not the requester)
    if (friendshipData.requester_id === userId) {
      return res.status(403).json({ error: 'Cannot reject your own friend request' });
    }

    // Check if user is part of this friendship
    if (friendshipData.user_id !== userId && friendshipData.friend_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to reject this request' });
    }

    // Check if pending
    if (friendshipData.status !== 'pending') {
      return res.status(400).json({ error: 'Friend request is not pending' });
    }

    // Reject the request (update status to rejected)
    await pool.query(
      `UPDATE friendships 
       SET status = 'rejected', updated_at = NOW()
       WHERE id = $1`,
      [friendshipId]
    );

    res.json({
      message: 'Friend request rejected successfully'
    });

  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ error: 'Server error rejecting friend request' });
  }
};

// @desc    Cancel friend request (sent by user)
// @route   DELETE /api/friends/request/:friendshipId
// @access  Private
const cancelFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendshipId } = req.params;

    // Validate friendshipId
    if (!friendshipId || !isValidUUID(friendshipId)) {
      return res.status(400).json({ error: 'Invalid friendship ID format' });
    }

    // Check if friendship exists and user is the requester
    const friendship = await pool.query(
      `SELECT id, status, requester_id 
       FROM friendships 
       WHERE id = $1`,
      [friendshipId]
    );

    if (friendship.rows.length === 0) {
      return res.status(404).json({ error: 'Friend request not found' });
    }

    const friendshipData = friendship.rows[0];

    // Check if user is the requester
    if (friendshipData.requester_id !== userId) {
      return res.status(403).json({ error: 'Cannot cancel request you did not send' });
    }

    // Check if still pending
    if (friendshipData.status !== 'pending') {
      return res.status(400).json({ error: 'Can only cancel pending requests' });
    }

    // Delete the friendship request
    await pool.query(
      'DELETE FROM friendships WHERE id = $1',
      [friendshipId]
    );

    res.json({
      message: 'Friend request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel friend request error:', error);
    res.status(500).json({ error: 'Server error cancelling friend request' });
  }
};

// @desc    Remove friend (unfriend)
// @route   DELETE /api/friends/:friendId
// @access  Private
const removeFriend = async (req, res) => {
  try {
    const userId = req.userId;
    const { friendId } = req.params;

    // Validate friendId
    if (!friendId || !isValidUUID(friendId)) {
      return res.status(400).json({ error: 'Invalid friend ID format' });
    }

    if (friendId === userId) {
      return res.status(400).json({ error: 'Cannot unfriend yourself' });
    }

    // Find and delete the friendship
    const result = await pool.query(
      `DELETE FROM friendships 
       WHERE ((user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1))
       AND status = 'accepted'
       RETURNING id`,
      [userId, friendId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Friendship not found or not accepted' });
    }

    res.json({
      message: 'Friend removed successfully'
    });

  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({ error: 'Server error removing friend' });
  }
};

module.exports = {
  getFriends,
  getFriendRequests,
  getSentRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend
};