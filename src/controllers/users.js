const {
  createUserService,
  getUserByClerkIdService,
  getUserByIdService,
  updateUserService,
  deleteUserService
} = require('../db/services');

// Create a new user
const createUser = async (req, res) => {
  try {
    const { clerk_id, email, full_name, avatar_url } = req.body;

    // Validate required fields
    if (!clerk_id || !email || !full_name) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const user = await createUserService({
      clerk_id,
      email,
      full_name,
      avatar_url
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error in createUser controller:', error);
    if (error.constraint === 'users_clerk_id_key') {
      return res.status(409).json({ error: 'User already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by clerk ID
const getUserByClerkId = async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await getUserByClerkIdService(clerkId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserByClerkId controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await getUserByIdService(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found, or invalid UUID format' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserById controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, avatar_url } = req.body;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await updateUserService(userId, {
      full_name,
      avatar_url
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in updateUser controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await deleteUserService(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in deleteUser controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getUserByClerkId,
  getUserById,
  updateUser,
  deleteUser
};
