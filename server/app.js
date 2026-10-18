const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { startCronJobs } = require('./cron/alertCron');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Allow inline SVG and scripts for custom UI ring rendering
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5000',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter for Authentication
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 20, // max 20 requests per 15 min window
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' }
});

app.use('/api/auth/login', loginLimiter);

// Static file serving
app.use(express.static(path.join(__dirname, '../public')));
const uploadsStaticDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsStaticDir));

// Health & Diagnostics Check
app.get('/api/health', (req, res) => {
  try {
    const db = require('./db/database');
    const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
    const mouCount = db.prepare('SELECT count(*) as count FROM mous WHERE is_deleted = 0').get().count;
    res.json({
      status: 'ok',
      environment: process.env.NODE_ENV || 'production',
      isVercel: !!process.env.VERCEL,
      usersInDb: userCount,
      activeMousInDb: mouCount
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      stack: err.stack
    });
  }
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/departments', require('./routes/deptRoutes'));
app.use('/api/industries', require('./routes/industryRoutes'));
app.use('/api/mous', require('./routes/mouRoutes'));
app.use('/api/commitments', require('./routes/commitmentRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/coe', require('./routes/coeRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/audit-logs', require('./routes/auditRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/status-config', require('./routes/statusConfigRoutes'));

// Serve HTML pages
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../public/login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '../public/admin.html')));
app.get('/chairperson', (req, res) => res.sendFile(path.join(__dirname, '../public/chairperson.html')));
app.get('/portal', (req, res) => res.sendFile(path.join(__dirname, '../public/chairperson.html')));

// Catch-all route to login page
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Start Cron & Background Excel Auto-Sync Watcher (Local/Server only)
if (!process.env.VERCEL) {
  startCronJobs();
  const { startExcelWatcher } = require('./services/excelSyncService');
  startExcelWatcher(4000);
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` MoU Management System Server running on port ${PORT}`);
    console.log(` Admin Portal:        http://localhost:${PORT}/admin`);
    console.log(` Chairperson Portal:  http://localhost:${PORT}/chairperson`);
    console.log(` Login Page:          http://localhost:${PORT}/login`);
    console.log(`====================================================`);
  });
}

module.exports = app;
