const express = require('express');
const router = express.Router();
const { generateTasks, getUserTasks, toggleTaskStatus } = require('../controllers/task.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All task routes require authentication
router.use(authenticateToken);

router.post('/generate', generateTasks);
router.get('/', getUserTasks);
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;
