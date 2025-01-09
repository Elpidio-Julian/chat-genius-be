// // Messages
// POST   /api/channels/:channelId/messages
// GET    /api/channels/:channelId/messages
// PATCH  /api/channels/:channelId/messages/:messageId
// DELETE /api/channels/:channelId/messages/:messageId
// GET    /api/messages/:messageId/thread

const db = require('../../src/db');
const {
  createMessageService,
  getChannelMessagesService, 
  updateMessageService,
  deleteMessageService,
  getThreadMessagesService,
  createUserService,
  createWorkspaceService,
  createChannelService
} = require('../../src/db/services');

describe('Message Database Services', () => {
  let testUser;
  let testWorkspace;
  let testChannel;

  beforeAll(async () => {
    // Create test user
    const userResult = await createUserService({
      clerk_id: 'test_clerk_123',
      email: 'test@example.com',
      full_name: 'Test User'
    });
    testUser = userResult;

    // Create test workspace
    const workspaceResult = await createWorkspaceService({
      name: 'Test Workspace',
      slug: 'test-workspace'
    });
    testWorkspace = workspaceResult;

    // Create test channel
    const channelResult = await createChannelService(testWorkspace.id, {
      name: 'general',
      description: 'General discussion'
    }, testUser.id);
    testChannel = channelResult;
  });

  beforeEach(async () => {
    // Clean up messages before each test
    await db.query('DELETE FROM messages WHERE channel_id = $1', [testChannel.id]);
  });


  describe('createMessageService', () => {
    it('should create a new message successfully', async () => {
      const messageData = {
        content: 'Test message',
        user_id: testUser.id,
        channel_id: testChannel.id
      };

      const message = await createMessageService(messageData);

      expect(message).toBeDefined();
      expect(message.content).toBe(messageData.content);
      expect(message.user_id).toBe(messageData.user_id);
      expect(message.channel_id).toBe(messageData.channel_id);
      expect(message.created_at).toBeDefined();
    });
  });

  describe('getChannelMessagesService', () => {
    it('should return messages for a channel', async () => {
      // Create test messages
      const messageData = {
        content: 'Test message for get',
        user_id: testUser.id,
        channel_id: testChannel.id
      };
      await createMessageService(messageData);

      const messages = await getChannelMessagesService(testChannel.id);

      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);
      expect(messages[0].content).toBeDefined();
      expect(messages[0].user_id).toBeDefined();
    });

    it('should return empty array for channel with no messages', async () => {
      // Create empty test channel
      const emptyChannelResult = await createChannelService(testWorkspace.id, {
        name: 'empty-channel',
        description: 'Empty channel'
      }, testUser.id);

      const messages = await getChannelMessagesService(emptyChannelResult.id);
      expect(messages).toEqual([]);
    });
  });

  describe('updateMessageService', () => {
    it('should update message successfully', async () => {
      const message = await createMessageService({
        content: 'Original message',
        user_id: testUser.id,
        channel_id: testChannel.id
      });

      const updatedMessage = await updateMessageService(message.id, {
        content: 'Updated message'
      });

      expect(updatedMessage.id).toBe(message.id);
      expect(updatedMessage.content).toBe('Updated message');
      expect(updatedMessage.updated_at).toBeDefined();
    });

    it('should return null for non-existent message', async () => {
      const result = await updateMessageService('non-existent-id', {
        content: 'Updated content'
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteMessageService', () => {
    it('should delete message successfully', async () => {
      const message = await createMessageService({
        content: 'Message to delete',
        user_id: testUser.id,
        channel_id: testChannel.id
      });

      const deletedMessage = await deleteMessageService(message.id);
      expect(deletedMessage.id).toBe(message.id);

      // Verify message is deleted
      const messages = await getChannelMessagesService(testChannel.id);
      expect(messages.find(m => m.id === message.id)).toBeUndefined();
    });

    it('should return null for non-existent message', async () => {
      const result = await deleteMessageService('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('getThreadMessagesService', () => {
    it('should return thread messages for a parent message', async () => {
      // Create parent message
      const parentMessage = await createMessageService({
        content: 'Parent message',
        user_id: testUser.id,
        channel_id: testChannel.id
      });

      // Create thread message
      const threadMessage = await createMessageService({
        content: 'Thread reply',
        user_id: testUser.id,
        channel_id: testChannel.id,
        parent_id: parentMessage.id
      });

      const threadMessages = await getThreadMessagesService(parentMessage.id);

      expect(Array.isArray(threadMessages)).toBe(true);
      expect(threadMessages.length).toBe(1);
      expect(threadMessages[0].id).toBe(threadMessage.id);
      expect(threadMessages[0].parent_id).toBe(parentMessage.id);
    });

    it('should return empty array for message with no replies', async () => {
      const message = await createMessageService({
        content: 'Message with no replies',
        user_id: testUser.id,
        channel_id: testChannel.id
      });

      const threadMessages = await getThreadMessagesService(message.id);
      expect(threadMessages).toEqual([]);
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('DELETE FROM messages WHERE channel_id = $1', [testChannel.id]);
    await db.query('DELETE FROM channels WHERE workspace_id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM workspaces WHERE id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM users WHERE id = $1', [testUser.id]);
  });
});
