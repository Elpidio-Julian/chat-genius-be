const db = require('../db');

// Jest setup configuration
beforeAll(async () => {
  // Use a separate database for testing
  process.env.DB_NAME = 'chatgenius_test';
  
  // Add any other test setup here, such as:
  // - Database connection
  // - Test data initialization
  // - Global test configurations
});

  // Clean up after all tests
afterAll(async () => {
  // Drop all tables after tests complete

  await db.pool.end();
  process.env.DB_NAME = 'chatgenius';
});
