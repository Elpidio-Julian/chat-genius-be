const db = require('../../db');

// UUID validation helper
const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};


const createMessageService = async ({ content, user_id, channel_id, parent_id = null }) => {
  
  const result = await db.query(
    `INSERT INTO messages (content, user_id, channel_id, parent_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [content, user_id, channel_id, parent_id]
  );
  return result.rows[0];
};

const getChannelMessagesService = async (channelId) => {
  const result = await db.query(
    `SELECT * FROM messages 
     WHERE channel_id = $1 AND parent_id IS NULL
     ORDER BY created_at DESC`,
    [channelId]
  );
  return result.rows;
};

const updateMessageService = async (messageId, { content }) => {
  if (!isValidUUID(messageId)) {
    return null;
  }

  const result = await db.query(
    `UPDATE messages
     SET content = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [content, messageId]
  );
  return result.rows[0] || null;
};

const deleteMessageService = async (messageId) => {
  if (!isValidUUID(messageId)) {
    return null;
  }

  const result = await db.query(
    `DELETE FROM messages
     WHERE id = $1
     RETURNING *`,
    [messageId]
  );
  return result.rows[0] || null;
};

const getThreadMessagesService = async (parentMessageId) => {
  if (!isValidUUID(parentMessageId)) {
    return null;
  }

  const result = await db.query(
    `SELECT * FROM messages
     WHERE parent_id = $1
     ORDER BY created_at ASC
     `,
    [parentMessageId]
  ); 

  return result.rows;
};

module.exports = {
  createMessageService,
  getChannelMessagesService,
  updateMessageService,
  deleteMessageService,
  getThreadMessagesService
};
