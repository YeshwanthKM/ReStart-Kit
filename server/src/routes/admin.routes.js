const express = require('express');
const router = express.Router();
const { getAllUsers, getAdminStats } = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// All admin routes require JWT token AND ADMIN role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/users', getAllUsers);
router.get('/stats', getAdminStats);

module.exports = router;
