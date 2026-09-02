const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint to verify backend status & connectivity
 * @access  Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: "ReStart Kit API is running",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
