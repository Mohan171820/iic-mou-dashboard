const express = require('express');
const router = express.Router();
const deptController = require('../controllers/deptController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', deptController.getDepartments);
router.post('/', authorizeRoles('Admin'), deptController.createDepartment);
router.put('/:id', authorizeRoles('Admin'), deptController.updateDepartment);
router.delete('/:id', authorizeRoles('Admin'), deptController.deleteDepartment);

module.exports = router;
