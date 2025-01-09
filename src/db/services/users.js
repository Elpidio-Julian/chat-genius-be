const db = require('../../db');

// Create a new user
const createUserService = async ({ clerk_id, email, full_name, avatar_url }) => {
  try {

    const result = await db.query(
      'INSERT INTO users (clerk_id, email, full_name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [clerk_id, email, full_name, avatar_url]
    );
    console.log('User created:', result.rows[0]); // remove later
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Get user by Clerk ID
const getUserByClerkIdService = async (clerkId) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE clerk_id = $1',
      [clerkId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by clerk_id:', error);
    throw error;
  }
};

// Get user by ID
const getUserByIdService = async (userId) => {
  try {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

// Update user
const updateUserService = async (userId, { full_name, avatar_url }) => {
  try {
    const result = await db.query(
      'UPDATE users SET full_name = COALESCE($1, full_name), avatar_url = COALESCE($2, avatar_url), updated_at = NOW() WHERE id = $3 RETURNING *',
      [full_name, avatar_url, userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Delete user
const deleteUserService = async (userId) => {
  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = {
  createUserService,
  getUserByClerkIdService,
  getUserByIdService,
  updateUserService,
  deleteUserService
};
