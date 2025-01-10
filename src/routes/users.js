const express = require('express');
const router = express.Router();
const { 
  createUser,
  getUserByClerkId,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/users');

// Create a new user
router.post('/', createUser);

// Get user by clerk ID
router.get('/:clerkId', getUserByClerkId);

// Get user by ID
router.get('/id/:userId', getUserById);

// Update user
router.patch('/:userId', updateUser);

// Delete user
router.delete('/:userId', deleteUser);

module.exports = router;
