const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

const { uploadExcel } = require('../middleware/upload');

router.get('/summary', dashboardController.getSummary);
router.get('/status-distribution', dashboardController.getStatusDistribution);
router.get('/department-progress', dashboardController.getDepartmentProgress);
router.get('/action-required', dashboardController.getActionRequired);
router.get('/monthly-trend', dashboardController.getMonthlyTrend);
router.get('/city-analytics', dashboardController.getCityAnalytics);
router.get('/pipeline-funnel', dashboardController.getPipelineFunnel);
router.get('/branch-analytics', dashboardController.getBranchAnalytics);
router.post('/upload-excel', uploadExcel.single('file'), dashboardController.uploadExcel);
router.post('/sync-local-excel', dashboardController.syncLocalExcel);
router.post('/sync-google-sheet', dashboardController.syncGoogleSheet);
router.get('/sync-status', dashboardController.getSyncStatus);

module.exports = router;
