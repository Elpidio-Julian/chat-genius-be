// // Workspaces
// POST   /api/workspaces
// GET    /api/workspaces
// GET    /api/workspaces/:id
// PATCH  /api/workspaces/:id

const { createWorkspaceService, getWorkspacesService, getWorkspaceByIdService, updateWorkspaceService } = require('../db/services');

// Create a new workspace
const createWorkspace = async (req, res) => {
  try {
    const { name, slug, icon_url } = req.body;

    const result = await createWorkspaceService(name, slug, icon_url);
    console.log('Created workspace:', result);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// Get all workspaces
const getWorkspaces = async (req, res) => {
  try {
    const result = await getWorkspacesService();
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single workspace by ID
const getWorkspaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getWorkspaceByIdService(id);
    
    if (result === null) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a workspace
const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, icon_url } = req.body;
    
    const result = await updateWorkspaceService(id, { name, slug, icon_url });

    if (result === null) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace
};
