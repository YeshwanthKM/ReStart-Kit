const express = require('express');
const router = express.Router();
const { getResources, getResourceById, createResource, deleteResource } = require('../controllers/resource.controller');
const { authenticateToken, requireRole } = require('../middleware/auth.middleware');

// Public / Authenticated Read Routes
router.get('/', getResources);
router.get('/:id', getResourceById);

// Admin-only Write Routes
router.post('/', authenticateToken, requireRole('ADMIN'), createResource);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteResource);

module.exports = router;
