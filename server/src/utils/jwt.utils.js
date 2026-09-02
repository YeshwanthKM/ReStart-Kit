const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'restart_kit_jwt_super_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a JWT token for a given user
 * @param {Object} payload - User details ({ id, email, role })
 * @returns {string} JWT Token
 */
const generateToken = (payload) => {
  return jwt.sign(
    {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'USER'
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken
};
