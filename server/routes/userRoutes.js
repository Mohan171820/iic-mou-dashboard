const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);
router.use(authorizeRoles('Admin'));

router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.patch('/:id/deactivate', userController.deactivateUser);
router.post('/:id/reset-password', userController.resetUserPassword);

module.exports = router;
