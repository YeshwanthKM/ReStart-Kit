const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All profile routes require authentication
router.use(authenticateToken);

router.get('/me', getProfile);
router.put('/me', updateProfile);

module.exports = router;
