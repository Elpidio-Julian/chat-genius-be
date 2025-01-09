const db = require('../../src/db');

describe('Database Connection', () => {
  test('can connect to database', async () => {
    try {
      const result = await db.query('SELECT NOW()');
      expect(result.rows).toBeDefined();
    } catch (err) {
      fail('Database connection failed: ' + err.message);
    }
  });

});
