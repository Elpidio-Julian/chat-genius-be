const { Pool } = require('pg');
const dbConfig = require('../config/database');

const pool = new Pool(dbConfig);


pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool, // Expose pool for testing
};