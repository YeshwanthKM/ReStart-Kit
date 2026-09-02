const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAdminStats, getTaskTemplates } = require('../controllers/admin.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// All admin routes require JWT token AND ADMIN role
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getAdminStats);
router.get('/task-templates', getTaskTemplates);

module.exports = router;
