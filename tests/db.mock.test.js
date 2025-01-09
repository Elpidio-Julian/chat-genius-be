const { Pool } = require('pg');

// Mock the pg module
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Database Module with Mocks', () => {
  let db;
  
  beforeEach(() => {
    jest.clearAllMocks();
    db = require('../src/db');
  });

  test('executes queries through the pool', async () => {
    const mockResult = { rows: [{ id: 1 }] };
    Pool.mock.results[0].value.query.mockResolvedValue(mockResult);

    const result = await db.query('SELECT * FROM test');
    expect(result).toBe(mockResult);
    expect(Pool.mock.results[0].value.query).toHaveBeenCalledWith('SELECT * FROM test');
  });
});

//unfinished, not to be used