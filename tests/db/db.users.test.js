const db = require('../../src/db');
const {
  createUserService,
  getUserByClerkIdService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} = require('../../src/db/services/users');

describe('User Database Services', () => {
  const testUser = {
    clerk_id: 'test_clerk_123',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.png'
  };

  beforeEach(async () => {
    // Clean up users before each test
    await db.query('DELETE FROM users WHERE email = $1', [testUser.email]);
  });

  describe('createUserService', () => {
    it('should create a new user successfully', async () => {
      const user = await createUserService(testUser);

      expect(user).toBeDefined();
      expect(user.clerk_id).toBe(testUser.clerk_id);
      expect(user.email).toBe(testUser.email);
      expect(user.full_name).toBe(testUser.full_name);
      expect(user.avatar_url).toBe(testUser.avatar_url);
    });

    it('should throw error when creating user with duplicate clerk_id', async () => {
      await createUserService(testUser);
      await expect(createUserService(testUser)).rejects.toThrow();
    });

    it('should throw error when creating user with duplicate email', async () => {
      await createUserService(testUser);
      await expect(createUserService({
        ...testUser,
        clerk_id: 'different_clerk_id'
      })).rejects.toThrow();
    });
  });

  describe('getUserByClerkIdService', () => {
    it('should return user by clerk_id', async () => {
      const createdUser = await createUserService(testUser);
      const user = await getUserByClerkIdService(testUser.clerk_id);

      expect(user).toBeDefined();
      expect(user.id).toBe(createdUser.id);
      expect(user.email).toBe(testUser.email);
    });

    it('should return null for non-existent clerk_id', async () => {
      const user = await getUserByClerkIdService('non_existent_clerk_id');
      expect(user).toBeNull();
    });
  });

  describe('getUserByIdService', () => {
    it('should return user by id', async () => {
      const createdUser = await createUserService(testUser);
      const user = await getUserByIdService(createdUser.id);

      expect(user).toBeDefined();
      expect(user.clerk_id).toBe(testUser.clerk_id);
      expect(user.email).toBe(testUser.email);
    });

    it('should return null for non-existent id', async () => {
      const user = await getUserByIdService('00000000-0000-0000-0000-000000000000');
      expect(user).toBeNull();
    });
  });

  describe('updateUserService', () => {
    it('should update user successfully', async () => {
      const createdUser = await createUserService(testUser);
      const updateData = {
        full_name: 'Updated Name',
        avatar_url: 'https://example.com/new-avatar.png'
      };

      const updatedUser = await updateUserService(createdUser.id, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.full_name).toBe(updateData.full_name);
      expect(updatedUser.avatar_url).toBe(updateData.avatar_url);
      expect(updatedUser.email).toBe(testUser.email); // Unchanged field
    });

    it('should return null when updating non-existent user', async () => {
      const result = await updateUserService('00000000-0000-0000-0000-000000000000', {
        full_name: 'Updated Name'
      });
      expect(result).toBeNull();
    });
  });

  describe('deleteUserService', () => {
    it('should delete user successfully', async () => {
      const createdUser = await createUserService(testUser);
      const deletedUser = await deleteUserService(createdUser.id);

      expect(deletedUser).toBeDefined();
      expect(deletedUser.id).toBe(createdUser.id);

      // Verify user is actually deleted
      const user = await getUserByIdService(createdUser.id);
      expect(user).toBeNull();
    });

    it('should return null when deleting non-existent user', async () => {
      const result = await deleteUserService('00000000-0000-0000-0000-000000000000');
      expect(result).toBeNull();
    });
  });
});
