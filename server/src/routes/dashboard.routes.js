const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Dashboard routes require authentication
router.use(authenticateToken);

router.get('/stats', getDashboardStats);

module.exports = router;
