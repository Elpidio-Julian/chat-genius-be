const db = require('../db');

// Jest setup configuration
beforeAll(async () => {
  // Use a separate database for testing
  process.env.POSTGRES_DB = 'chatgenius_test';
  
  // Add any other test setup here, such as:
  // - Database connection
  // - Test data initialization
  // - Global test configurations
});

  // Clean up after all tests
afterAll(async () => {
  await db.pool.end();
  process.env.POSTGRES_DB = 'chatgenius';
});
