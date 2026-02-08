const { sendResponse } = require("../../utils/sendResponse");
const {
    addTeamMemberDb,
    getAllTeamMembersDb,
    getTeamMemberByIdDb,
    updateTeamMemberDb,
    deleteTeamMemberDb
} = require("../../db/teamMember/teamMember");
const { uploadOrUpdateImages } = require("../../utils/cloudinaryUtil");

const addTeamMember = async (req, res) => {
    try {
        const memberData = req.body;

        if (!memberData.fullName || !memberData.description) {
            return sendResponse(req, res, 400, 'Full name and description are required');
        }

        if (req.files && req.files.length > 0) {
            const imageResult = await uploadOrUpdateImages({
                files: req.files,
                folder: 'teamMembers'
            });
            memberData.images = imageResult;
        }

        const result = await addTeamMemberDb(memberData);
        return sendResponse(req, res, result.statusCode || 201, 'Team member added successfully',);
    } catch (error) {
        console.error('Error in addTeamMember:', error);
        return sendResponse(req, res, 500, error.message || 'Failed to add team member');
    }
};

const getAllTeamMembers = async (req, res) => {
    try {
        const members = await getAllTeamMembersDb();
        return sendResponse(req, res, 200, members);
    } catch (error) {
        console.error('Error in getAllTeamMembers:', error);
        return sendResponse(req, res, 500, 'Failed to retrieve team members');
    }
};

const getTeamMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        const member = await getTeamMemberByIdDb(id);

        if (!member) {
            return sendResponse(req, res, 404, 'Team member not found');
        }

        return sendResponse(req, res, 200, member);
    } catch (error) {
        console.error('Error in getTeamMemberById:', error);
        return sendResponse(req, res, 500, 'Failed to retrieve team member');
    }
};

const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const existingMember = await getTeamMemberByIdDb(id);
        if (!existingMember) {
            return sendResponse(req, res, 404, 'Team member not found');
        }

        if (req.files && req.files.length > 0) {
            const imageResult = await uploadOrUpdateImages({
                files: req.files,
                oldImages: existingMember.images,
                folder: 'teamMembers'
            });
            updateData.images = imageResult;
        }

        const result = await updateTeamMemberDb(id, updateData);

        return sendResponse(req, res, result.statusCode, result.clientMessage, result.data);
    } catch (error) {
        console.error('Error in updateTeamMember:', error);
        return sendResponse(req, res, 500, 'Failed to update team member');
    }
};

const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const existingMember = await getTeamMemberByIdDb(id);

        if (!existingMember) {
            return sendResponse(req, res, 404, 'Team member not found');
        }

        const result = await deleteTeamMemberDb(id);

        return sendResponse(req, res, result.statusCode || 200, result.message || 'Team member deleted successfully');
    } catch (error) {
        console.error('Error in deleteTeamMember:', error);
        return sendResponse(req, res, 500, 'Failed to delete team member');
    }
};

module.exports = {
    addTeamMember,
    getAllTeamMembers,
    getTeamMemberById,
    updateTeamMember,
    deleteTeamMember
};