const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

class User {
  static async findOne({ email }) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async create(userData) {
    const { email, password, name, mobile } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (email, password, name, mobile, subscription, credits, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const values = [email, hashedPassword, name, mobile || '', 'free', 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async createOAuthUser(userData) {
    const { provider, providerId, email, name, picture } = userData;

    const query = `
      INSERT INTO users (
        email, name, provider, provider_id, picture, subscription, credits, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const values = [email, name, provider, providerId, picture || null, 'free', 0];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByProvider(provider, providerId) {
    const query = 'SELECT * FROM users WHERE provider = $1 AND provider_id = $2';
    const result = await pool.query(query, [provider, providerId]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
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

// Database initialization is now handled in config/database.js

module.exports = User;
