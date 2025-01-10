const db = require('../../src/db');
const {
  createChannelMemberService,
  getChannelMembersService,
  isChannelMemberService,
  deleteChannelMemberService,
  createUserService,
  createWorkspaceService,
  createChannelService
} = require('../../src/db/services');

describe('Channel Members Database Services', () => {
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
    // Clean up channel members before each test
    await db.query('DELETE FROM channel_members WHERE channel_id = $1', [testChannel.id]);
  });

  describe('createChannelMemberService', () => {
    it('should add a member to channel successfully', async () => {
      const memberData = {
        channel_id: testChannel.id,
        user_id: testUser.id
      };

      const member = await createChannelMemberService(memberData);

      expect(member).toBeDefined();
      expect(member.channel_id).toBe(memberData.channel_id);
      expect(member.user_id).toBe(memberData.user_id);
      expect(member.created_at).toBeDefined();
    });

    it('should not allow duplicate membership', async () => {
      const memberData = {
        channel_id: testChannel.id,
        user_id: testUser.id
      };

      await createChannelMemberService(memberData);
      
      await expect(createChannelMemberService(memberData))
        .rejects
        .toThrow();
    });
  });

  describe('getChannelMembersService', () => {
    it('should return members of a channel', async () => {
      // Add test member
      const memberData = {
        channel_id: testChannel.id,
        user_id: testUser.id
      };
      await createChannelMemberService(memberData);

      const members = await getChannelMembersService(testChannel.id);

      expect(Array.isArray(members)).toBe(true);
      expect(members.length).toBe(1);
      expect(members[0].user_id).toBe(memberData.user_id);
      expect(members[0].channel_id).toBe(memberData.channel_id);
    });

    it('should return empty array for channel with no members', async () => {
      const members = await getChannelMembersService(testChannel.id);
      expect(members).toEqual([]);
    });
  });

  describe('isChannelMemberService', () => {
    it('should return true for existing member', async () => {
      // Add test member
      const memberData = {
        channel_id: testChannel.id,
        user_id: testUser.id
      };
      await createChannelMemberService(memberData);

      const isMember = await isChannelMemberService(testChannel.id, testUser.id);
      expect(isMember).toBe(true);
    });

    it('should return false for non-member', async () => {
      const isMember = await isChannelMemberService(testChannel.id, testUser.id);
      expect(isMember).toBe(false);
    });
  });

  describe('deleteChannelMemberService', () => {
    it('should remove member successfully', async () => {
      // Add member to remove
      const memberData = {
        channel_id: testChannel.id,
        user_id: testUser.id
      };
      await createChannelMemberService(memberData);

      const deletedMember = await deleteChannelMemberService(testChannel.id, testUser.id);

      expect(deletedMember).toBeDefined();
      expect(deletedMember.channel_id).toBe(memberData.channel_id);
      expect(deletedMember.user_id).toBe(memberData.user_id);

      // Verify member is removed
      const isMember = await isChannelMemberService(testChannel.id, testUser.id);
      expect(isMember).toBe(false);
    });

    it('should return null for non-existent member', async () => {
      const result = await deleteChannelMemberService(testChannel.id, testUser.id);
      expect(result).toBeNull();
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.query('DELETE FROM channels WHERE workspace_id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM workspaces WHERE id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM users WHERE id = $1', [testUser.id]);
  });
});
