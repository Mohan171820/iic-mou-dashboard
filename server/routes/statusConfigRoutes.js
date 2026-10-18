const express = require('express');
const router = express.Router();
const statusConfigController = require('../controllers/statusConfigController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', statusConfigController.getStatusConfigs);
router.put('/:id', authorizeRoles('Admin'), statusConfigController.updateStatusConfig);

module.exports = router;
