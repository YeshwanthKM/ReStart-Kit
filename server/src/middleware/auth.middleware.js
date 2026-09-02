const { verifyToken } = require('../utils/jwt.utils');

/**
 * Middleware to authenticate requests using JWT Bearer tokens
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required. Please log in.'
    });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.'
    });
  }
};

/**
 * Middleware to restrict route access by role (e.g., ADMIN)
 * @param {string|string[]} roles - Allowed role(s)
 */
const requireRole = (roles) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires ${allowedRoles.join(' or ')} permission.`
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
