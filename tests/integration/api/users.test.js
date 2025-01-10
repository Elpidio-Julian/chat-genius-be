const request = require('supertest');
const app = require('../../../src/app');
const db = require('../../../src/db');


describe('Users API', () => {

  const testUser = {
    clerk_id: 'test_clerk_123',
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.png'
  };

  beforeEach(async () => {
    // Clean up the users table before each test
    await db.query('DELETE FROM users');
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      try {
        const response = await request(app)
          .post('/api/users')
          .send(testUser)
          .expect(201);

        expect(response.body).toMatchObject({
          clerk_id: testUser.clerk_id,
          email: testUser.email,
          full_name: testUser.full_name,
          avatar_url: testUser.avatar_url
        });
        expect(response.body.id).toBeDefined();
        expect(response.body.created_at).toBeDefined();
        expect(response.body.updated_at).toBeDefined();
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });

    it('should return 400 if required fields are missing', async () => {
      const invalidUser = {
        email: 'test@example.com',
        full_name: 'Test User'
      };

      try {
        await request(app)
          .post('/api/users')
          .send(invalidUser)
          .expect(400);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });

    it('should return 409 if clerk_id already exists', async () => {
      try {
        // First create a user
        await request(app)
          .post('/api/users')
          .send(testUser);

        // Try to create another user with the same clerk_id
        await request(app)
          .post('/api/users')
          .send(testUser)
          .expect(409);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });
  });

  describe('GET /api/users/:clerkId', () => {
    it('should get a user by clerk ID', async () => {
      try {
        // First create a user
        await request(app)
          .post('/api/users')
          .send(testUser);

        const response = await request(app)
          .get(`/api/users/${testUser.clerk_id}`)
          .expect(200);

        expect(response.body).toMatchObject({
          clerk_id: testUser.clerk_id,
          email: testUser.email,
          full_name: testUser.full_name,
          avatar_url: testUser.avatar_url
        });
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });

    it('should return 404 if user not found', async () => {
      try {
        await request(app)
          .get('/api/users/nonexistent_clerk_id')
          .expect(404);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });
  });

  describe('GET /api/users/id/:userId', () => {
    it('should get a user by ID', async () => {
      try {
        // First create a user
        const createResponse = await request(app)
          .post('/api/users')
          .send(testUser);

        const userId = createResponse.body.id;

        const response = await request(app)
          .get(`/api/users/id/${userId}`)
          .expect(200);

        expect(response.body).toMatchObject({
          clerk_id: testUser.clerk_id,
          email: testUser.email,
          full_name: testUser.full_name,
          avatar_url: testUser.avatar_url
        });
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });

    it('should return 404 if user not found', async () => {
      try {
        await request(app)
          .get('/api/users/id/123e4567-e89b-12d3-a456-426614174000')
          .expect(404);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });
  });

  describe('PATCH /api/users/:userId', () => {
    it('should update user information', async () => {
      try {
        // First create a user
        const createResponse = await request(app)
          .post('/api/users')
          .send(testUser);

        const userId = createResponse.body.id;
        const updateData = {
          full_name: 'Updated Name',
          avatar_url: 'https://example.com/new-avatar.png'
        };

        const response = await request(app)
          .patch(`/api/users/${userId}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toMatchObject({
          ...testUser,
          ...updateData
        });
        expect(response.body.updated_at).not.toBe(createResponse.body.updated_at);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });

    it('should return 400 if invalid UUID format', async () => {
      try {
        await request(app)
          .patch('/api/users/invalid-uuid')
          .send({ full_name: 'Updated Name' })
          .expect(400);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should delete a user', async () => {
      try {
        // First create a user
        const createResponse = await request(app)
          .post('/api/users')
          .send(testUser);

        const userId = createResponse.body.id;

        await request(app)
          .delete(`/api/users/${userId}`)
          .expect(200);

        // Verify user is deleted
        await request(app)
          .get(`/api/users/id/${userId}`)
          .expect(404);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });

    it('should return 400 if invalid UUID format', async () => {
      try {
        await request(app)
          .delete('/api/users/invalid-uuid')
          .expect(400);
      } catch (error) {
        console.error('Test error:', error);
        console.error('Response:', error.response?.text);
        throw error;
      }
    });
  });

  afterAll(async () => {
    await db.query('DELETE FROM users');
  });
});
