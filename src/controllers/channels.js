// // Channels
// POST   /api/workspaces/:workspaceId/channels
// GET    /api/workspaces/:workspaceId/channels
// PATCH  /api/workspaces/:workspaceId/channels/:channelId
// DELETE /api/workspaces/:workspaceId/channels/:channelId

const db = require('../db');

// Create a new channel in a workspace
const createChannel = async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO channels (workspace_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [workspaceId, name, description]
    );

    res.status(201).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating channel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create channel',
      error: error.message
    });
  }
};

// Get all channels in a workspace
const getChannels = async (req, res) => {
  const { workspaceId } = req.params;

  try {
    const result = await db.query(
      'SELECT * FROM channels WHERE workspace_id = $1 ORDER BY created_at DESC',
      [workspaceId]
    );

    res.status(200).json({
      status: 'success',
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({
      status: 'error', 
      message: 'Failed to fetch channels',
      error: error.message
    });
  }
};

// Update a channel
const updateChannel = async (req, res) => {
  const { channelId } = req.params;
  const { name, description } = req.body;

  try {
    const result = await db.query(
      'UPDATE channels SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [name, description, channelId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Channel not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating channel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update channel',
      error: error.message
    });
  }
};

// Delete a channel
const deleteChannel = async (req, res) => {
  const { channelId } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM channels WHERE id = $1 RETURNING *',
      [channelId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Channel not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Channel deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting channel:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete channel',
      error: error.message
    });
  }
};

module.exports = {
  createChannel,
  getChannels,
  updateChannel,
  deleteChannel
};
