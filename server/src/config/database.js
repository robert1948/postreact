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
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20),
        subscription VARCHAR(50) DEFAULT 'free',
        credits INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      )
    `);

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
