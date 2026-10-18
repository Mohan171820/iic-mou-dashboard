const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', meetingController.getMeetings);
router.post('/', authorizeRoles('Admin', 'Coordinator'), meetingController.createMeeting);
router.put('/:id', authorizeRoles('Admin', 'Coordinator'), meetingController.updateMeeting);
router.delete('/:id', authorizeRoles('Admin'), meetingController.deleteMeeting);

module.exports = router;
