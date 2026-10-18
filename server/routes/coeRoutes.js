const express = require('express');
const router = express.Router();
const coeController = require('../controllers/coeController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/coes', coeController.getCoes);
router.post('/coes', authorizeRoles('Admin'), coeController.createCoe);

router.get('/activities', coeController.getCoeActivities);
router.post('/activities', authorizeRoles('Admin', 'Coordinator'), coeController.createCoeActivity);

router.get('/revenue', coeController.getRevenueItems);
router.post('/revenue', authorizeRoles('Admin'), coeController.createRevenueItem);

module.exports = router;
