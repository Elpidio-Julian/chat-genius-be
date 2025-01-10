const db = require('../index');

/**
 * Creates a new channel member
 * @param {Object} data Channel member data
 * @param {string} data.channel_id UUID of the channel
 * @param {string} data.user_id UUID of the user
 * @returns {Promise<Object>} Created channel member
 */
const createChannelMemberService = async ({ channel_id, user_id }) => {
  const result = await db.query(
    `INSERT INTO channel_members (channel_id, user_id)
     VALUES ($1, $2)
     RETURNING *`,
    [channel_id, user_id]
  );
  return result.rows[0];
};

/**
 * Gets all members of a channel
 * @param {string} channel_id UUID of the channel
 * @returns {Promise<Array>} Array of channel members
 */
const getChannelMembersService = async (channel_id) => {
  const result = await db.query(
    `SELECT *
     FROM channel_members
     WHERE channel_id = $1
     ORDER BY created_at ASC`,
    [channel_id]
  );
  return result.rows;
};

/**
 * Checks if a user is a member of a channel
 * @param {string} channel_id UUID of the channel
 * @param {string} user_id UUID of the user
 * @returns {Promise<boolean>} True if user is a member, false otherwise
 */
const isChannelMemberService = async (channel_id, user_id) => {
  const result = await db.query(
    `SELECT EXISTS (
      SELECT 1
      FROM channel_members
      WHERE channel_id = $1
      AND user_id = $2
    ) as is_member`,
    [channel_id, user_id]
  );
  return result.rows[0].is_member;
};

/**
 * Removes a member from a channel
 * @param {string} channel_id UUID of the channel
 * @param {string} user_id UUID of the user
 * @returns {Promise<Object|null>} Deleted channel member or null if not found
 */
const deleteChannelMemberService = async (channel_id, user_id) => {
  const result = await db.query(
    `DELETE FROM channel_members
     WHERE channel_id = $1
     AND user_id = $2
     RETURNING *`,
    [channel_id, user_id]
  );
  return result.rows[0] || null;
};

module.exports = {
  createChannelMemberService,
  getChannelMembersService,
  isChannelMemberService,
  deleteChannelMemberService
};
