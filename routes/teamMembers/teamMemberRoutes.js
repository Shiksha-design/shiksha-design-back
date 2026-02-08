const express = require('express');
const router = express.Router();
const teamMemberController = require('../../controllers/teamMember/teamMemberController');
const { uploadSingle } = require('../../middlewares/multerConfig');
const { uploadTeamMemberImages } = require('../../middlewares/uploadMiddleware');

router.get('/', teamMemberController.getAllTeamMembers);
router.get('/:id', teamMemberController.getTeamMemberById);
router.post('/create', uploadTeamMemberImages, teamMemberController.addTeamMember);
router.put('/:id', uploadTeamMemberImages, teamMemberController.updateTeamMember);
router.delete('/:id', teamMemberController.deleteTeamMember);

module.exports = router;