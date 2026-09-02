const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Root route
app.get('/api', (req, res) => {
  res.json({
    message: "Welcome to ReStart Kit API",
    healthCheck: "/api/health"
  });
});

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to ReStart Kit API",
    healthCheck: "/api/health"
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack || err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server locally if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 ReStart Kit Backend Server listening on port ${PORT}`);
    console.log(`📍 Health Check API available at http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
