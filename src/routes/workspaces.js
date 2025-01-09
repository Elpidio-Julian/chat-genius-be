// // Workspaces
// POST   /api/workspaces
// GET    /api/workspaces
// GET    /api/workspaces/:id
// PATCH  /api/workspaces/:id

const express = require('express');
const router = express.Router();
const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace
} = require('../controllers/workspaces');

// Create a new workspace
router.post('/', createWorkspace);

// Get all workspaces
router.get('/', getWorkspaces);

// Get a single workspace by ID
router.get('/:id', getWorkspaceById);

// Update a workspace
router.patch('/:id', updateWorkspace);

module.exports = router;
