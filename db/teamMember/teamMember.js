const { Responses } = require("../../utils/responses");
const TeamMember = require("../../models/teamMemberModel");

const addTeamMemberDb = async (memberData) => {
    try {
        const teamMember = new TeamMember(memberData);
        await teamMember.save();
        return { ...Responses.success, data: teamMember };
    } catch (error) {
        console.error('Error creating team member:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const getAllTeamMembersDb = async () => {
    try {
        const teamMembers = await TeamMember.find({ delete: false })
            .sort({ create: -1 });
        return teamMembers;
    } catch (error) {
        console.error('Error getting team members:', error);
        return [];
    }
};

const getTeamMemberByIdDb = async (id) => {
    try {
        const teamMember = await TeamMember.findOne({ _id: id, delete: false });
        if (!teamMember) {
            return null;
        }
        return teamMember;
    } catch (error) {
        console.error('Error getting team member by ID:', error);
        return null;
    }
};

const updateTeamMemberDb = async (id, updateData) => {
    try {
        updateData.update = Date.now();
        const teamMember = await TeamMember.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!teamMember) {
            return Responses.notFound;
        }

        return { ...Responses.success, data: teamMember };
    } catch (error) {
        console.error('Error updating team member:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const deleteTeamMemberDb = async (id) => {
    try {
        const teamMember = await TeamMember.findByIdAndUpdate(
            id,
            { delete: true, update: Date.now() },
            { new: true }
        );

        if (!teamMember) {
            return Responses.notFound;
        }

        return Responses.success;
    } catch (error) {
        console.error('Error deleting team member:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

module.exports = {
    addTeamMemberDb,
    getAllTeamMembersDb,
    getTeamMemberByIdDb,
    updateTeamMemberDb,
    deleteTeamMemberDb
};