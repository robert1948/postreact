const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
};

const pool = new Pool(connectionConfig);

// Add error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
