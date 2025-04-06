const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = process.env.DATABASE_URL;

// Configure the database connection based on the environment
const pool = new Pool({
  connectionString,
  ssl: isProduction ? {
    rejectUnauthorized: false,
    require: true
  } : false
});

// Function to initialize the database
const initializeDatabase = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database');

    // Check if users table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'users'
      );
    `);

    if (tableExists.rows[0].exists) {
      // Table exists, check for missing columns
      console.log('Users table exists, checking for missing columns...');

      // Check if mobile column exists
      const mobileColumnExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'mobile'
        );
      `);

      if (!mobileColumnExists.rows[0].exists) {
        // Add mobile column
        console.log('Adding mobile column to users table...');
        await client.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS mobile VARCHAR(20)
        `);
      }

      // Check if provider column exists
      const providerColumnExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'users'
          AND column_name = 'provider'
        );
      `);

      if (!providerColumnExists.rows[0].exists) {
        // Add OAuth columns
        console.log('Adding OAuth columns to users table...');
        await client.query(`
          ALTER TABLE users
          ADD COLUMN IF NOT EXISTS provider VARCHAR(50),
          ADD COLUMN IF NOT EXISTS provider_id VARCHAR(255),
          ADD COLUMN IF NOT EXISTS picture VARCHAR(255),
          ALTER COLUMN password DROP NOT NULL
        `);
      }
    } else {
      // Create users table if it doesn't exist
      console.log('Creating users table...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255),
          name VARCHAR(255) NOT NULL,
          mobile VARCHAR(20),
          provider VARCHAR(50),
          provider_id VARCHAR(255),
          picture VARCHAR(255),
          subscription VARCHAR(50) DEFAULT 'free',
          credits INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP
        )
      `);

      console.log('Users table created with all required columns.');
    }

    // Add provider and provider_id index if columns exist
    try {
      const columnsExist = await client.query(`
        SELECT
          EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'provider') AS provider_exists,
          EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'provider_id') AS provider_id_exists
      `);

      if (columnsExist.rows[0].provider_exists && columnsExist.rows[0].provider_id_exists) {
        console.log('Creating index on provider and provider_id...');
        await client.query(`
          CREATE INDEX IF NOT EXISTS idx_users_provider_provider_id
          ON users(provider, provider_id)
        `);
      }
    } catch (err) {
      console.log('Error creating index:', err.message);
    }

    console.log('Database tables initialized');
    client.release();
  } catch (error) {
    console.error('Error initializing database:', error);
    // Don't exit the process in production, but do in development to catch issues early
    if (!isProduction) {
      console.error('Database initialization failed. Exiting...');
      process.exit(1);
    }
  }
};

module.exports = {
  pool,
  initializeDatabase
};
