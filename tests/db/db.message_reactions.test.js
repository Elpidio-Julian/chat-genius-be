const db = require('../../src/db');
const {
  createMessageReactionService,
  getMessageReactionsService,
  deleteMessageReactionService,
  toggleMessageReactionService,
  createUserService,
  createWorkspaceService,
  createChannelService,
  createMessageService
} = require('../../src/db/services');

describe('Message Reactions Database Services', () => {
  let testUser;
  let testWorkspace;
  let testChannel;
  let testMessage;

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

    // Create test message
    const messageResult = await createMessageService({
      content: 'Test message for reactions',
      user_id: testUser.id,
      channel_id: testChannel.id
    });
    testMessage = messageResult;
  });

  beforeEach(async () => {
    // Clean up reactions before each test
    await db.query('DELETE FROM message_reactions WHERE message_id = $1', [testMessage.id]);
  });

  describe('createMessageReactionService', () => {
    it('should create a new message reaction successfully', async () => {
      const reactionData = {
        message_id: testMessage.id,
        user_id: testUser.id,
        emoji: '👍'
      };

      const reaction = await createMessageReactionService(reactionData);

      expect(reaction).toBeDefined();
      expect(reaction.message_id).toBe(reactionData.message_id);
      expect(reaction.user_id).toBe(reactionData.user_id);
      expect(reaction.emoji).toBe(reactionData.emoji);
      expect(reaction.created_at).toBeDefined();
    });

    it('should not allow duplicate reactions from same user with same emoji', async () => {
      const reactionData = {
        message_id: testMessage.id,
        user_id: testUser.id,
        emoji: '👍'
      };

      await createMessageReactionService(reactionData);
      
      await expect(createMessageReactionService(reactionData))
        .rejects
        .toThrow();
    });
  });

  describe('getMessageReactionsService', () => {
    it('should return reactions for a message', async () => {
      // Create test reaction
      const reactionData = {
        message_id: testMessage.id,
        user_id: testUser.id,
        emoji: '👍'
      };
      await createMessageReactionService(reactionData);

      const reactions = await getMessageReactionsService(testMessage.id);

      expect(Array.isArray(reactions)).toBe(true);
      expect(reactions.length).toBe(1);
      expect(reactions[0].emoji).toBe(reactionData.emoji);
      expect(reactions[0].user_id).toBe(reactionData.user_id);
    });

    it('should return empty array for message with no reactions', async () => {
      const reactions = await getMessageReactionsService(testMessage.id);
      expect(reactions).toEqual([]);
    });
  });

  describe('deleteMessageReactionService', () => {
    it('should delete reaction successfully', async () => {
      // Create reaction to delete
      const reactionData = {
        message_id: testMessage.id,
        user_id: testUser.id,
        emoji: '👍'
      };
      await createMessageReactionService(reactionData);

      const deletedReaction = await deleteMessageReactionService(
        testMessage.id,
        testUser.id,
        '👍'
      );

      expect(deletedReaction).toBeDefined();
      expect(deletedReaction.emoji).toBe(reactionData.emoji);

      // Verify reaction is deleted
      const reactions = await getMessageReactionsService(testMessage.id);
      expect(reactions.length).toBe(0);
    });

    it('should return null for non-existent reaction', async () => {
      const result = await deleteMessageReactionService(
        testMessage.id,
        testUser.id,
        '👍'
      );
      expect(result).toBeNull();
    });
  });

  describe('toggleMessageReactionService', () => {
    it('should add reaction when it does not exist', async () => {
      const reactionData = {
        message_id: testMessage.id,
        user_id: testUser.id,
        emoji: '👍'
      };

      const result = await toggleMessageReactionService(reactionData);

      expect(result.added).toBe(true);
      expect(result.reaction).toBeDefined();
      expect(result.reaction.emoji).toBe(reactionData.emoji);

      // Verify reaction exists
      const reactions = await getMessageReactionsService(testMessage.id);
      expect(reactions.length).toBe(1);
    });

    it('should remove reaction when it exists', async () => {
      // First add the reaction
      const reactionData = {
        message_id: testMessage.id,
        user_id: testUser.id,
        emoji: '👍'
      };
      await createMessageReactionService(reactionData);

      // Then toggle it off
      const result = await toggleMessageReactionService(reactionData);

      expect(result.added).toBe(false);
      expect(result.reaction).toBeDefined();
      expect(result.reaction.emoji).toBe(reactionData.emoji);

      // Verify reaction is removed
      const reactions = await getMessageReactionsService(testMessage.id);
      expect(reactions.length).toBe(0);
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

