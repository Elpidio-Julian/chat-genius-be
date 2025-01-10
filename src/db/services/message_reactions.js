const db = require('../index');

/**
 * Creates a new message reaction
 * @param {Object} data Reaction data
 * @param {string} data.message_id UUID of the message
 * @param {string} data.user_id UUID of the user
 * @param {string} data.emoji The emoji reaction
 * @returns {Promise<Object>} Created reaction
 */
const createMessageReactionService = async ({ message_id, user_id, emoji }) => {
  const result = await db.query(
    `INSERT INTO message_reactions (message_id, user_id, emoji)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [message_id, user_id, emoji]
  );
  return result.rows[0];
};

/**
 * Gets all reactions for a message
 * @param {string} message_id UUID of the message
 * @returns {Promise<Array>} Array of reactions
 */
const getMessageReactionsService = async (message_id) => {
  const result = await db.query(
    `SELECT *
     FROM message_reactions
     WHERE message_id = $1
     ORDER BY created_at ASC`,
    [message_id]
  );
  return result.rows;
};

/**
 * Deletes a specific reaction
 * @param {string} message_id UUID of the message
 * @param {string} user_id UUID of the user
 * @param {string} emoji The emoji to remove
 * @returns {Promise<Object|null>} Deleted reaction or null if not found
 */
const deleteMessageReactionService = async (message_id, user_id, emoji) => {
  const result = await db.query(
    `DELETE FROM message_reactions
     WHERE message_id = $1
     AND user_id = $2
     AND emoji = $3
     RETURNING *`,
    [message_id, user_id, emoji]
  );
  return result.rows[0] || null;
};

/**
 * Toggles a reaction (adds if not exists, removes if exists)
 * @param {Object} data Reaction data
 * @param {string} data.message_id UUID of the message
 * @param {string} data.user_id UUID of the user
 * @param {string} data.emoji The emoji reaction
 * @returns {Promise<Object>} Object containing { added: boolean, reaction: Object }
 */
const toggleMessageReactionService = async ({ message_id, user_id, emoji }) => {
  // First try to delete the reaction
  const deleted = await deleteMessageReactionService(message_id, user_id, emoji);
  
  // If reaction existed and was deleted
  if (deleted) {
    return {
      added: false,
      reaction: deleted
    };
  }
  
  // If reaction didn't exist, create it
  const created = await createMessageReactionService({ message_id, user_id, emoji });
  return {
    added: true,
    reaction: created
  };
};

module.exports = {
  createMessageReactionService,
  getMessageReactionsService,
  deleteMessageReactionService,
  toggleMessageReactionService
};
