const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: isProduction ? {
    rejectUnauthorized: false,
    require: true
  } : false
});

module.exports = pool;
