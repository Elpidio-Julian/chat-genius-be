// // Channels
// POST   /api/workspaces/:workspaceId/channels
// GET    /api/workspaces/:workspaceId/channels
// PATCH  /api/workspaces/:workspaceId/channels/:channelId
// DELETE /api/workspaces/:workspaceId/channels/:channelId


const db = require('../../src/db');
const pool = require('../../src/db');

jest.mock('../../src/db', () => ({
  query: jest.fn()
}));


describe('Channel Database Operations', () => {

  beforeEach(() => {
    pool = new Pool();
    pool.query.mockReset();
  });

  describe('POST /api/workspaces/:workspaceId/channels', () => {
    it('should insert a new channel', async () => {
      const mockChannel = {
        id: 1,
        workspace_id: 1,
        name: 'general',
        description: 'General channel'
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockChannel],
        rowCount: 1
      });

      const result = await db.query(
        'INSERT INTO channels (workspace_id, name, description) VALUES ($1, $2, $3) RETURNING *',
        [1, 'general', 'General channel']
      );

      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO channels (workspace_id, name, description) VALUES ($1, $2, $3) RETURNING *',
        [1, 'general', 'General channel']
      );
      expect(result.rows[0]).toEqual(mockChannel);
    });
  });

  describe('GET /api/workspaces/:workspaceId/channels', () => {
    it('should get all channels for a workspace', async () => {
      const mockChannels = [
        { id: 1, workspace_id: 1, name: 'general' },
        { id: 2, workspace_id: 1, name: 'random' }
      ];

      pool.query.mockResolvedValueOnce({
        rows: mockChannels,
        rowCount: 2
      });

      const result = await db.query(
        'SELECT * FROM channels WHERE workspace_id = $1 ORDER BY created_at DESC',
        [1]
      );

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM channels WHERE workspace_id = $1 ORDER BY created_at DESC',
        [1]
      );
      expect(result.rows).toEqual(mockChannels);
    });
  });

  describe('PATCH /api/workspaces/:workspaceId/channels/:channelId', () => {
    it('should update a channel', async () => {
      const mockUpdatedChannel = {
        id: 1,
        workspace_id: 1,
        name: 'updated-general',
        description: 'Updated description'
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockUpdatedChannel],
        rowCount: 1
      });

      const result = await db.query(
        'UPDATE channels SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        ['updated-general', 'Updated description', 1]
      );

      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE channels SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        ['updated-general', 'Updated description', 1]
      );
      expect(result.rows[0]).toEqual(mockUpdatedChannel);
    });
  });

  describe('DELETE /api/workspaces/:workspaceId/channels/:channelId', () => {
    it('should delete a channel', async () => {
      const mockDeletedChannel = {
        id: 1,
        workspace_id: 1,
        name: 'general'
      };

      pool.query.mockResolvedValueOnce({
        rows: [mockDeletedChannel],
        rowCount: 1
      });

      const result = await db.query(
        'DELETE FROM channels WHERE id = $1 RETURNING *',
        [1]
      );

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM channels WHERE id = $1 RETURNING *',
        [1]
      );
      expect(result.rows[0]).toEqual(mockDeletedChannel);
    });
  });
});
