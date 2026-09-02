const express = require('express');
const router = express.Router();
const { getAssessment, createOrUpdateAssessment } = require('../controllers/assessment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All assessment routes require authentication
router.use(authenticateToken);

router.get('/me', getAssessment);
router.post('/', createOrUpdateAssessment);

module.exports = router;
