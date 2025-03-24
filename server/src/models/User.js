const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

class User {
  static async findOne({ email }) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { email, password, name } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password, name, subscription, credits, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    
    const values = [email, hashedPassword, name, 'free', 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async save(user) {
    const query = `
      UPDATE users 
      SET last_login = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const result = await pool.query(query, [user.id]);
    return result.rows[0];
  }
}

// Create users table if it doesn't exist
const initializeDb = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      subscription VARCHAR(50) DEFAULT 'free',
      credits INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    )
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log('Users table initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDb();

module.exports = User;
