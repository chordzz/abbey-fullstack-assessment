const pool = require('../config/database');

// UUID validation helper
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// @desc    Get user's followers
// @route   GET /api/followers
// @access  Private
const getFollowers = async (req, res) => {
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
        f.created_at as followed_date,
        (SELECT COUNT(*) FROM friendships 
         WHERE (user_id = u.id OR friend_id = u.id) 
         AND status = 'accepted') as friends_count,
        (SELECT COUNT(*) FROM followers 
         WHERE following_id = u.id) as followers_count,
        -- Check if current user follows them back
        (SELECT COUNT(*) > 0 FROM followers 
         WHERE follower_id = $1 AND following_id = u.id) as is_following_back,
        -- Check friendship status
        (SELECT status FROM friendships 
         WHERE ((user_id = $1 AND friend_id = u.id) 
             OR (friend_id = $1 AND user_id = u.id))
         LIMIT 1) as friendship_status
       FROM users u
       INNER JOIN followers f ON f.follower_id = u.id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      followers: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Server error fetching followers' });
  }
};

// @desc    Get users that current user is following
// @route   GET /api/followers/following
// @access  Private
const getFollowing = async (req, res) => {
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
        f.created_at as followed_date,
        (SELECT COUNT(*) FROM friendships 
         WHERE (user_id = u.id OR friend_id = u.id) 
         AND status = 'accepted') as friends_count,
        (SELECT COUNT(*) FROM followers 
         WHERE following_id = u.id) as followers_count,
        -- Check if they follow you back
        (SELECT COUNT(*) > 0 FROM followers 
         WHERE follower_id = u.id AND following_id = $1) as follows_you_back,
        -- Check friendship status
        (SELECT status FROM friendships 
         WHERE ((user_id = $1 AND friend_id = u.id) 
             OR (friend_id = $1 AND user_id = u.id))
         LIMIT 1) as friendship_status
       FROM users u
       INNER JOIN followers f ON f.following_id = u.id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [userId]
    );

    res.json({
      following: result.rows,
      total: result.rows.length
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({ error: 'Server error fetching following list' });
  }
};

// @desc    Follow a user
// @route   POST /api/followers/follow
// @access  Private
const followUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { followingId } = req.body;

    // Validation
    if (!followingId) {
      return res.status(400).json({ error: 'User ID to follow is required' });
    }

    if (!isValidUUID(followingId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (followingId === userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if user exists
    const userExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [followingId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const alreadyFollowing = await pool.query(
      'SELECT id FROM followers WHERE follower_id = $1 AND following_id = $2',
      [userId, followingId]
    );

    if (alreadyFollowing.rows.length > 0) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    // Create follow relationship
    await pool.query(
      `INSERT INTO followers (follower_id, following_id, created_at)
       VALUES ($1, $2, NOW())`,
      [userId, followingId]
    );

    res.status(201).json({
      message: 'User followed successfully'
    });

  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Server error following user' });
  }
};

// @desc    Unfollow a user
// @route   DELETE /api/followers/unfollow/:userId
// @access  Private
const unfollowUser = async (req, res) => {
  try {
    const userId = req.userId;
    const { userId: unfollowUserId } = req.params;

    // Validate userId
    if (!unfollowUserId || !isValidUUID(unfollowUserId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (unfollowUserId === userId) {
      return res.status(400).json({ error: 'Cannot unfollow yourself' });
    }

    // Delete follow relationship
    const result = await pool.query(
      `DELETE FROM followers 
       WHERE follower_id = $1 AND following_id = $2
       RETURNING id`,
      [userId, unfollowUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'You are not following this user' });
    }

    res.json({
      message: 'User unfollowed successfully'
    });

  } catch (error) {
    console.error('Unfollow user error:', error);
    res.status(500).json({ error: 'Server error unfollowing user' });
  }
};

// @desc    Remove a follower
// @route   DELETE /api/followers/remove/:userId
// @access  Private
const removeFollower = async (req, res) => {
  try {
    const userId = req.userId;
    const { userId: followerId } = req.params;

    // Validate userId
    if (!followerId || !isValidUUID(followerId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (followerId === userId) {
      return res.status(400).json({ error: 'Cannot remove yourself' });
    }

    // Delete follow relationship where the other user follows you
    const result = await pool.query(
      `DELETE FROM followers 
       WHERE follower_id = $1 AND following_id = $2
       RETURNING id`,
      [followerId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'This user is not following you' });
    }

    res.json({
      message: 'Follower removed successfully'
    });

  } catch (error) {
    console.error('Remove follower error:', error);
    res.status(500).json({ error: 'Server error removing follower' });
  }
};

// @desc    Get follower statistics
// @route   GET /api/followers/stats
// @access  Private
const getFollowerStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get counts
    const followersCount = await pool.query(
      'SELECT COUNT(*) as count FROM followers WHERE following_id = $1',
      [userId]
    );

    const followingCount = await pool.query(
      'SELECT COUNT(*) as count FROM followers WHERE follower_id = $1',
      [userId]
    );

    // Get mutual follows (people who follow you and you follow back)
    const mutualFollows = await pool.query(
      `SELECT COUNT(*) as count FROM followers f1
       WHERE f1.following_id = $1
       AND EXISTS (
         SELECT 1 FROM followers f2 
         WHERE f2.follower_id = $1 AND f2.following_id = f1.follower_id
       )`,
      [userId]
    );

    res.json({
      stats: {
        followers: parseInt(followersCount.rows[0].count),
        following: parseInt(followingCount.rows[0].count),
        mutualFollows: parseInt(mutualFollows.rows[0].count)
      }
    });

  } catch (error) {
    console.error('Get follower stats error:', error);
    res.status(500).json({ error: 'Server error fetching follower stats' });
  }
};

module.exports = {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  removeFollower,
  getFollowerStats
};