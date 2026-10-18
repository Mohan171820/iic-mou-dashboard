const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);
router.use(authorizeRoles('Admin'));

router.get('/', auditController.getAuditLogs);

module.exports = router;
