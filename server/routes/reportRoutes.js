const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/mou-status.xlsx', reportController.exportMouStatusExcel);
router.get('/commitments.xlsx', reportController.exportCommitmentsExcel);
router.get('/coe-revenue.xlsx', reportController.exportCoeRevenueExcel);
router.get('/mou-summary.pdf', reportController.exportMouPdfReport);

router.post('/import/mous', authorizeRoles('Admin', 'Coordinator'), reportController.importMousCsv);

module.exports = router;
