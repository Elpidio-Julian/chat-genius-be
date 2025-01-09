// -- Workspace members - manages user membership and roles in workspaces
// CREATE TABLE workspace_members (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
//     user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//     role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'member')),
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(workspace_id, user_id)
// );

const db = require('../../src/db');
const {
  createWorkspaceMemberService,
  getWorkspaceMembersService, 
  updateWorkspaceMemberRoleService,
  deleteWorkspaceMemberService,
  createUserService,
  createWorkspaceService
} = require('../../src/db/services');

describe('Workspace Members Database Services', () => {
  let testUser;
  let testWorkspace;

  beforeEach(async () => {
    // Create test user
    testUser = await createUserService({
      clerk_id: 'test_clerk_123',
      email: 'test@example.com',
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.png'
    });

    // Create test workspace
    testWorkspace = await createWorkspaceService({
      name: 'Test Workspace',
      slug: 'test-workspace',
      icon_url: 'https://example.com/icon.png'
    });
  });

  describe('createWorkspaceMemberService', () => {
    it('should add a member to workspace successfully', async () => {
      const member = await createWorkspaceMemberService(testWorkspace.id, testUser.id, 'member');

      expect(member).toBeDefined();
      expect(member.workspace_id).toBe(testWorkspace.id);
      expect(member.user_id).toBe(testUser.id);
      expect(member.role).toBe('member');
    });

    it('should add an admin to workspace successfully', async () => {
      const member = await createWorkspaceMemberService(testWorkspace.id, testUser.id, 'admin');
      expect(member.role).toBe('admin');
    });

    it('should throw error when adding duplicate member', async () => {
      await createWorkspaceMemberService(testWorkspace.id, testUser.id, 'member');
      await expect(
        createWorkspaceMemberService(testWorkspace.id, testUser.id, 'member')
      ).rejects.toThrow();
    });
  });

  describe('getWorkspaceMembersService', () => {
    it('should return all members of a workspace', async () => {
      await createWorkspaceMemberService(testWorkspace.id, testUser.id, 'member');
      
      const members = await getWorkspaceMembersService(testWorkspace.id);
      
      expect(members).toHaveLength(1);
      expect(members[0].user_id).toBe(testUser.id);
      expect(members[0].role).toBe('member');
    });

    it('should return empty array for workspace with no members', async () => {
      const members = await getWorkspaceMembersService(testWorkspace.id);
      expect(members).toHaveLength(0);
    });
  });

  describe('updateWorkspaceMemberRoleService', () => {
    it('should update member role successfully', async () => {
      const member = await createWorkspaceMemberService(testWorkspace.id, testUser.id, 'member');
      
      const updatedMember = await updateWorkspaceMemberRoleService(member.id, 'admin');
      
      expect(updatedMember.role).toBe('admin');
    });

    it('should return null for non-existent member', async () => {
      const nonExistentId = '123e4567-e89b-12d3-a456-426614174000';
      const result = await updateWorkspaceMemberRoleService(nonExistentId, 'admin');
      expect(result).toBeNull();
    });
  });

  describe('deleteWorkspaceMemberService', () => {
    it('should remove member successfully', async () => {
      const member = await createWorkspaceMemberService(testWorkspace.id, testUser.id, 'member');
      
      const removedMember = await deleteWorkspaceMemberService(member.id);
      expect(removedMember.id).toBe(member.id);

      const members = await getWorkspaceMembersService(testWorkspace.id);
      expect(members).toHaveLength(0);
    });
  });

  afterEach(async () => {
    // Clean up test data
    await db.query('DELETE FROM workspace_members WHERE workspace_id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM workspaces WHERE id = $1', [testWorkspace.id]);
    await db.query('DELETE FROM users WHERE id = $1', [testUser.id]);
  });
});
