const express = require('express');
const router = express.Router();
const industryController = require('../controllers/industryController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', industryController.getIndustries);
router.get('/:id', industryController.getIndustryById);
router.post('/', authorizeRoles('Admin'), industryController.createIndustry);
router.put('/:id', authorizeRoles('Admin'), industryController.updateIndustry);
router.delete('/:id', authorizeRoles('Admin'), industryController.deleteIndustry);

module.exports = router;
