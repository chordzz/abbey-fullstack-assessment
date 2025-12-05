

const pool = require('../config/database');

// @desc    Get current user's profile with stats
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user info
    const userResult = await pool.query(
      `SELECT id, email, name, bio, address, avatar_url, created_at, updated_at
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get friends count (accepted friendships)
    const friendsResult = await pool.query(
      `SELECT COUNT(*) as count FROM friendships 
       WHERE (user_id = $1 OR friend_id = $1) 
       AND status = 'accepted'`,
      [userId]
    );

    // Get followers count
    const followersResult = await pool.query(
      `SELECT COUNT(*) as count FROM followers 
       WHERE following_id = $1`,
      [userId]
    );

    // Get following count
    const followingResult = await pool.query(
      `SELECT COUNT(*) as count FROM followers 
       WHERE follower_id = $1`,
      [userId]
    );

    res.json({
      user: {
        ...user,
        stats: {
          friends: parseInt(friendsResult.rows[0].count),
          followers: parseInt(followersResult.rows[0].count),
          following: parseInt(followingResult.rows[0].count)
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, bio, address, avatar_url } = req.body;

    // Validation
    if (name && name.trim().length === 0) {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ error: 'Bio must be 500 characters or less' });
    }

    if (address && address.length > 200) {
      return res.status(400).json({ error: 'Address must be 200 characters or less' });
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name.trim());
      paramCount++;
    }

    if (bio !== undefined) {
      updates.push(`bio = $${paramCount}`);
      values.push(bio.trim() || null);
      paramCount++;
    }

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(address.trim() || null);
      paramCount++;
    }

    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount}`);
      values.push(avatar_url.trim() || null);
      paramCount++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`);
    
    // Add userId to values
    values.push(userId);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, bio, address, avatar_url, updated_at
    `;

    const result = await pool.query(query, values);

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

// @desc    Get all users (for Explore page)
// @route   GET /api/users/all
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const userId = req.userId;
    const { search, page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT u.id, u.email, u.name, u.bio, u.avatar_url, u.created_at,
             (SELECT COUNT(*) FROM friendships 
              WHERE (user_id = u.id OR friend_id = u.id) 
              AND status = 'accepted') as friends_count,
             (SELECT COUNT(*) FROM followers 
              WHERE following_id = u.id) as followers_count,
             -- Check if current user is friends with this user
             (SELECT status FROM friendships 
              WHERE ((user_id = $1 AND friend_id = u.id) 
                  OR (friend_id = $1 AND user_id = u.id))
              LIMIT 1) as friendship_status,
             -- Check if current user is following this user
             (SELECT COUNT(*) > 0 FROM followers 
              WHERE follower_id = $1 AND following_id = u.id) as is_following
      FROM users u
      WHERE u.id != $1
    `;

    const values = [userId];
    let paramCount = 2;

    // Add search filter if provided
    if (search && search.trim().length > 0) {
      query += ` AND (u.name ILIKE $${paramCount} OR u.email ILIKE $${paramCount})`;
      values.push(`%${search.trim()}%`);
      paramCount++;
    }

    query += ` ORDER BY u.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM users WHERE id != $1';
    const countValues = [userId];
    
    if (search && search.trim().length > 0) {
      countQuery += ' AND (name ILIKE $2 OR email ILIKE $2)';
      countValues.push(`%${search.trim()}%`);
    }

    const countResult = await pool.query(countQuery, countValues);
    const totalUsers = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalUsers / limit)
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// @desc    Get specific user's public profile
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;


    const result = await pool.query(
      `SELECT u.id, u.email, u.name, u.bio, u.address, u.avatar_url, u.created_at,
              (SELECT COUNT(*) FROM friendships 
               WHERE (user_id = u.id OR friend_id = u.id) 
               AND status = 'accepted') as friends_count,
              (SELECT COUNT(*) FROM followers 
               WHERE following_id = u.id) as followers_count,
              (SELECT COUNT(*) FROM followers 
               WHERE follower_id = u.id) as following_count,
              -- Check friendship status with current user
              (SELECT status FROM friendships 
               WHERE ((user_id = $2 AND friend_id = u.id) 
                   OR (friend_id = $2 AND user_id = u.id))
               LIMIT 1) as friendship_status,
              -- Check if current user sent friend request
              (SELECT requester_id FROM friendships 
               WHERE ((user_id = $2 AND friend_id = u.id) 
                   OR (friend_id = $2 AND user_id = u.id))
               LIMIT 1) as requester_id,
              -- Check if current user is following this user
              (SELECT COUNT(*) > 0 FROM followers 
               WHERE follower_id = $2 AND following_id = u.id) as is_following
       FROM users u
       WHERE u.id = $1`,
      [id, currentUserId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        address: user.address,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        stats: {
          friends: parseInt(user.friends_count),
          followers: parseInt(user.followers_count),
          following: parseInt(user.following_count)
        },
        relationship: {
          friendship_status: user.friendship_status || null,
          is_requester: user.requester_id === currentUserId,
          is_following: user.is_following
        }
      }
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById
};