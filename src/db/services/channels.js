// // Channels
// POST   /api/workspaces/:workspaceId/channels
// GET    /api/workspaces/:workspaceId/channels
// PATCH  /api/workspaces/:workspaceId/channels/:channelId
// DELETE /api/workspaces/:workspaceId/channels/:channelId

const db = require('../../db');

// Create a new channel in a workspace
const createChannelService = async (workspaceId, { name, description }, userId) => {
  try {
    const result = await db.query(
      'INSERT INTO channels (workspace_id, name, description, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [workspaceId, name, description, userId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error creating channel:', error);
    throw error;
  }
};

// Get all channels in a workspace
const getChannelsService = async (workspaceId) => {
  try {
    const result = await db.query(
      'SELECT * FROM channels WHERE workspace_id = $1 ORDER BY created_at DESC',
      [workspaceId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching channels:', error);
    throw error;
  }
};

// Update a channel
const updateChannelService = async (channelId, { name, description }) => {
  try {
    const result = await db.query(
      'UPDATE channels SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, description, channelId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error updating channel:', error);
    throw error;
  }
};

// Delete a channel
const deleteChannelService = async (channelId) => {
  try {
    const result = await db.query(
      'DELETE FROM channels WHERE id = $1 RETURNING *',
      [channelId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting channel:', error);
    throw error;
  }
};

module.exports = {
  createChannelService,
  getChannelsService,
  updateChannelService,
  deleteChannelService
};

