const express = require('express');
const router = express.Router();
const mouController = require('../controllers/mouController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { uploadImage, uploadDoc } = require('../middleware/upload');

router.use(verifyToken);

// Read endpoints accessible by Admin, Chairperson, Coordinator
router.get('/', mouController.getMous);
router.get('/:id', mouController.getMouById);

// Admin & Coordinator create/update
router.post('/', authorizeRoles('Admin', 'Coordinator'), mouController.createMou);
router.put('/:id', authorizeRoles('Admin', 'Coordinator'), mouController.updateMou);
router.patch('/:id/status', authorizeRoles('Admin', 'Coordinator'), mouController.updateMouStatus);

// Soft delete & restore (Admin only)
router.delete('/:id', authorizeRoles('Admin'), mouController.deleteMou);
router.post('/:id/restore', authorizeRoles('Admin'), mouController.restoreMou);

// Image management
router.post('/:id/images', authorizeRoles('Admin', 'Chairperson', 'Coordinator'), uploadImage.array('images', 5), mouController.uploadMouImages);
router.delete('/:id/images/:imageId', authorizeRoles('Admin', 'Chairperson', 'Coordinator'), mouController.deleteMouImage);

// Document management
router.post('/:id/documents', authorizeRoles('Admin', 'Coordinator'), uploadDoc.single('document'), mouController.uploadMouDocument);
router.delete('/:id/documents/:docId', authorizeRoles('Admin', 'Coordinator'), mouController.deleteMouDocument);

// Chairperson and Admin remarks/comments
router.post('/:id/comments', authorizeRoles('Admin', 'Chairperson', 'Coordinator'), mouController.addComment);

module.exports = router;
