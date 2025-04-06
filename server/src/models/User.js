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

    try {
      // Try with mobile column
      const query = `
        INSERT INTO users (email, password, name, mobile, subscription, credits, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *
      `;

      const values = [email, hashedPassword, name, mobile || '', 'free', 0];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      // If mobile column doesn't exist, try without it
      if (error.code === '42703' && error.message.includes('column "mobile" of relation "users" does not exist')) {
        console.log('Mobile column not found, trying without it...');

        const fallbackQuery = `
          INSERT INTO users (email, password, name, subscription, credits, created_at)
          VALUES ($1, $2, $3, $4, $5, NOW())
          RETURNING *
        `;

        const fallbackValues = [email, hashedPassword, name, 'free', 0];
        const fallbackResult = await pool.query(fallbackQuery, fallbackValues);
        return fallbackResult.rows[0];
      }

      // If it's another error, rethrow it
      throw error;
    }
  }

  static async createOAuthUser(userData) {
    const { provider, providerId, email, name, picture } = userData;

    try {
      // First check if user with this email already exists
      const checkQuery = 'SELECT * FROM users WHERE email = $1';
      const checkResult = await pool.query(checkQuery, [email]);

      if (checkResult.rows.length > 0) {
        // User already exists, update with OAuth info if possible
        const existingUser = checkResult.rows[0];
        console.log(`User with email ${email} already exists, updating with OAuth info...`);

        try {
          // Try to update with provider info
          const updateQuery = `
            UPDATE users
            SET provider = $1, provider_id = $2, picture = $3
            WHERE id = $4
            RETURNING *
          `;

          const updateValues = [provider, providerId, picture || null, existingUser.id];
          const updateResult = await pool.query(updateQuery, updateValues);
          return updateResult.rows[0];
        } catch (updateError) {
          // If provider columns don't exist, just return the existing user
          if (updateError.code === '42703') {
            console.log('Provider columns not found, returning existing user...');
            return existingUser;
          }
          throw updateError;
        }
      }

      // User doesn't exist, create new user with OAuth info
      try {
        // Try with provider and provider_id columns
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
      } catch (insertError) {
        // If provider columns don't exist, try a simplified insert
        if (insertError.code === '42703' &&
            (insertError.message.includes('column "provider" of relation "users" does not exist') ||
             insertError.message.includes('column "provider_id" of relation "users" does not exist'))) {

          console.log('Provider columns not found, trying simplified insert...');

          const fallbackQuery = `
            INSERT INTO users (email, name, subscription, credits, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
          `;

          const fallbackValues = [email, name, 'free', 0];
          const fallbackResult = await pool.query(fallbackQuery, fallbackValues);
          return fallbackResult.rows[0];
        }

        throw insertError;
      }
    } catch (error) {
      console.error('Error in createOAuthUser:', error);
      throw error;
    }
  }

  static async findByProvider(provider, providerId) {
    try {
      // First try to find by provider and provider_id
      try {
        const query = 'SELECT * FROM users WHERE provider = $1 AND provider_id = $2';
        const result = await pool.query(query, [provider, providerId]);
        if (result.rows.length > 0) {
          return result.rows[0];
        }
      } catch (error) {
        // If provider columns don't exist, continue to the next approach
        if (error.code !== '42703') {
          throw error;
        }
        console.log('Provider columns not found, trying alternative approach...');
      }

      // If we couldn't find by provider or the columns don't exist,
      // we'll need to get the email from the OAuth profile and check for that
      // This would be done in the passport strategy, not here

      return null;
    } catch (error) {
      console.error('Error in findByProvider:', error);
      throw error;
    }
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
