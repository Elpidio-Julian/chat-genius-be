// Jest setup configuration
beforeAll(async () => {
  // Use a separate database for testing
  process.env.POSTGRES_DB = 'chatgenius_test';
  
  // Add any other test setup here, such as:
  // - Database connection
  // - Test data initialization
  // - Global test configurations
});

afterAll(async () => {
  // Cleanup after all tests complete
  // For example:
  // - Close database connections
  // - Clear test data
  // - Reset environment variables
});