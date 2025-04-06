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

    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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

    // Add provider and provider_id index if it doesn't exist
    try {
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_users_provider_provider_id
        ON users(provider, provider_id)
      `);
    } catch (err) {
      console.log('Index may already exist:', err.message);
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
