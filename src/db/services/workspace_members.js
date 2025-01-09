// POST   /api/workspaces/:workspaceId/members
// GET    /api/workspaces/:workspaceId/members
// DELETE /api/workspaces/:workspaceId/members/:memberId
// PATCH    /api/workspaces/:workspaceId/members/:memberId/role

const db = require('../../db');

// Create a new workspace member (invite)
const createWorkspaceMemberService = async (workspaceId, id, role ) => {
  try {
    const result = await db.query(
      'INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
      [workspaceId, id, role]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating workspace member:', error);
    throw error;
  }
};

// Get all members in a workspace
const getWorkspaceMembersService = async (workspaceId) => {
  try {
    const result = await db.query(
      'SELECT * FROM workspace_members WHERE workspace_id = $1 ORDER BY created_at DESC',
      [workspaceId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    throw error;
  }
};
// Update a workspace member's role
const updateWorkspaceMemberRoleService = async (memberId, role) => {
  try {
    const result = await db.query(
      `UPDATE workspace_members 
       SET role = COALESCE($1, role),
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2 
       RETURNING *`,
      [role, memberId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating workspace member role:', error);
    throw error;
  }
};

// Delete a workspace member
const deleteWorkspaceMemberService = async (memberId) => {
  try {
    const result = await db.query(
      'DELETE FROM workspace_members WHERE id = $1 RETURNING *',
      [memberId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting workspace member:', error);
    throw error;
  }
};

module.exports = {
  createWorkspaceMemberService,
  getWorkspaceMembersService, 
  deleteWorkspaceMemberService,
  updateWorkspaceMemberRoleService
};
