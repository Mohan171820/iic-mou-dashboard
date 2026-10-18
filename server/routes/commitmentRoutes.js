const express = require('express');
const router = express.Router();
const commitmentController = require('../controllers/commitmentController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', commitmentController.getCommitments);
router.post('/', authorizeRoles('Admin', 'Coordinator'), commitmentController.createCommitment);
router.put('/:id', authorizeRoles('Admin', 'Coordinator'), commitmentController.updateCommitment);
router.delete('/:id', authorizeRoles('Admin'), commitmentController.deleteCommitment);

module.exports = router;
