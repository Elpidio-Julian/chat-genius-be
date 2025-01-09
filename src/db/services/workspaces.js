// // Workspaces
// POST   /api/workspaces
// GET    /api/workspaces
// GET    /api/workspaces/:id
// PATCH  /api/workspaces/:id


const db = require('../../db');

// UUID validation helper
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Create a new workspace
const createWorkspaceService = async ({ name, slug, icon_url }) => {
  try {
    const result = await db.query(
      'INSERT INTO workspaces (name, slug, icon_url) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, icon_url]
    );
    return result.rows[0];

  } catch (err) {
    console.error('Error creating workspace:', err);
    throw err;
  }
};


// Get all workspaces
const getWorkspacesService = async () => {
  try {
    const result = await db.query('SELECT * FROM workspaces ORDER BY created_at DESC');
    return result.rows;

  } catch (err) {
    console.error('Error getting workspaces:', err);
    throw err;
  }
};

// Get a single workspace by ID
const getWorkspaceByIdService = async (id) => {
  try {
    if (!isValidUUID(id)) {
      return null;
    }

    const result = await db.query('SELECT * FROM workspaces WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  } catch (err) {
    console.error('Error getting workspace by ID:', err);
    throw err;
  }
};

// Update a workspace
const updateWorkspaceService = async (id, { name, slug, icon_url }) => {
  try {
    if (!isValidUUID(id)) {
      return null;
    }

    const result = await db.query(
      `UPDATE workspaces 
       SET name = COALESCE($1, name), 
           slug = COALESCE($2, slug), 
           icon_url = COALESCE($3, icon_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 
       RETURNING *`,
      [name, slug, icon_url, id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    console.error('Error updating workspace:', err);
    throw err;
  }
};

module.exports = {
  createWorkspaceService,
  getWorkspacesService,
  getWorkspaceByIdService,
  updateWorkspaceService
};
