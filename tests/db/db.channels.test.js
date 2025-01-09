const db = require('../../src/db');
const {
  createChannelService,
  getChannelsService,
  updateChannelService,
  deleteChannelService,
} = require('../../src/db/services/channels');
const { createUserService } = require('../../src/db/services/users');
const { createWorkspaceService } = require('../../src/db/services/workspaces');

describe('Channel Database Services', () => {
  let testUser;
  let testWorkspace;

  beforeAll(async () => {
    // Create a test user
    testUser = await createUserService({
      clerk_id: 'test_clerk_channels',
      email: 'channels_test@example.com',
      full_name: 'Test Channel User',
      avatar_url: 'https://example.com/avatar.png'
    });

    // Create a test workspace
    testWorkspace = await createWorkspaceService({
      name: 'Test Workspace',
      slug: 'test-workspace-channels'
    });
  });

  beforeEach(async () => {
    // Clean up channels before each test
    await db.query('DELETE FROM channels WHERE workspace_id = $1', [testWorkspace.id]);
  });

  describe('createChannelService', () => {
    it('should create a new channel successfully', async () => {
      const channelData = {
        name: 'general',
        description: 'General discussion'
      };

      const channel = await createChannelService(testWorkspace.id, channelData, testUser.id);

      expect(channel).toBeDefined();
      expect(channel.name).toBe(channelData.name);
      expect(channel.description).toBe(channelData.description);
      expect(channel.workspace_id).toBe(testWorkspace.id);
      expect(channel.created_by).toBe(testUser.id);
    });
  });

  describe('getChannelsService', () => {
    it('should return all channels in a workspace', async () => {
      const channelData = {
        name: 'general',
        description: 'General discussion'
      };

      await createChannelService(testWorkspace.id, channelData, testUser.id);
      const channels = await getChannelsService(testWorkspace.id);

      expect(channels).toHaveLength(1);
      expect(channels[0].name).toBe(channelData.name);
    });
  });

  describe('updateChannelService', () => {
    it('should update channel successfully', async () => {
      const channel = await createChannelService(
        testWorkspace.id,
        { name: 'general', description: 'General discussion' },
        testUser.id
      );

      const updatedChannel = await updateChannelService(channel.id, {
        name: 'updated-general',
        description: 'Updated description'
      });

      expect(updatedChannel.name).toBe('updated-general');
      expect(updatedChannel.description).toBe('Updated description');
    });
  });

  describe('deleteChannelService', () => {
    it('should delete channel successfully', async () => {
      const channel = await createChannelService(
        testWorkspace.id,
        { name: 'general', description: 'General discussion' },
        testUser.id
      );

      const deletedChannel = await deleteChannelService(channel.id);
      expect(deletedChannel.id).toBe(channel.id);

      const channels = await getChannelsService(testWorkspace.id);
      expect(channels).toHaveLength(0);
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('DELETE FROM workspaces WHERE id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM users WHERE id = $1', [testUser.id]);
  });
});

