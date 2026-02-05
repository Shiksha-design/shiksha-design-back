const { Responses } = require("../../utils/responses");
const JobPosting = require("../../models/careerModel");

const addJobPostingDb = async (jobData) => {
    try {
        const jobPosting = new JobPosting(jobData);
        await jobPosting.save();
        return { ...Responses.success, data: jobPosting };
    } catch (error) {
        console.error('Error creating job posting:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const getAllJobPostingsDb = async () => {
    try {
        const jobPostings = await JobPosting.find({ isDeleted: false, isVisible: true })
            .sort({ createdAt: -1 });
        return jobPostings;
    } catch (error) {
        console.error('Error getting job postings:', error);
        return [];
    }
};

const getJobPostingByIdDb = async (id) => {
    try {
        const jobPosting = await JobPosting.findOne({ _id: id, isDeleted: false });
        if (!jobPosting) {
            return [];
        }
        return jobPosting;
    } catch (error) {
        console.error('Error getting job posting by ID:', error);
        return []
    }
};

const updateJobPostingDb = async (id, updateData) => {
    try {
        const jobPosting = await JobPosting.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        if (!jobPosting) {
            return Responses.notFound;
        }

        return { ...Responses.success, data: jobPosting };
    } catch (error) {
        console.error('Error updating job posting:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const deleteJobPostingDb = async (id) => {
    try {
        const jobPosting = await JobPosting.findByIdAndUpdate(
            id,
            { isDeleted: true, deletedAt: Date.now() },
            { new: true }
        );

        if (!jobPosting) {
            return Responses.notFound;
        }

        return Responses.success;
    } catch (error) {
        console.error('Error deleting job posting:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const searchJobPostingsDb = async (query) => {
    try {
        const results = await JobPosting.find(
            { $text: { $search: query }, isDeleted: false, isVisible: true },
            { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } });

        return { ...Responses.success, data: results };
    } catch (error) {
        console.error('Error searching job postings:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

module.exports = {
    addJobPostingDb,
    getAllJobPostingsDb,
    getJobPostingByIdDb,
    updateJobPostingDb,
    deleteJobPostingDb,
    searchJobPostingsDb
};
