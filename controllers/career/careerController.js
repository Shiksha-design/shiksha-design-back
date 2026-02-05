
const { sendResponse } = require("../../utils/sendResponse");
const {
    addJobPostingDb,
    getAllJobPostingsDb,
    getJobPostingByIdDb,
    updateJobPostingDb,
    deleteJobPostingDb,
    searchJobPostingsDb
} = require("../../db/career/career");

const addJobPosting = async (req, res) => {
    try {
        const jobData = req.body;

        // Basic validation
        if (!jobData.jobRole || !jobData.jobType || !jobData.jobLocation || !jobData.jobDescription) {
            return sendResponse(req, res, 400, 'Missing required fields');
        }

        if (req.files && req.files.length > 0) {
            jobData.image = req.files.map(file => ({
                publicId: file.public_id || file.filename,
                url: file.secure_url || file.path,
            }));
        }

        const result = await addJobPostingDb(jobData);
        return sendResponse(req, res, result.statusCode || 201, result.message || 'Job posting created successfully', result.data);
    } catch (error) {
        console.error('Error in addJobPosting:', error);
        return sendResponse(req, res, error.statusCode || 500, error.message || 'Failed to create job posting');
    }
};

const getAllJobPostings = async (req, res) => {
    try {
        const result = await getAllJobPostingsDb();
        return sendResponse(req, res, result.statusCode || 200, result);
    } catch (error) {
        console.error('Error in getAllJobPostings:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to retrieve job postings'
        );
    }
};

const getJobPostingById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getJobPostingByIdDb(id);

        if (result.statusCode === 404) {
            return sendResponse(req, res, 404, 'Job posting not found');
        }

        return sendResponse(
            req,
            res,
            200,
            'Job posting retrieved successfully',
            result.data
        );
    } catch (error) {
        console.error('Error in getJobPostingById:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to retrieve job posting'
        );
    }
};

const updateJobPosting = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await updateJobPostingDb(id, updateData);

        if (result.statusCode === 404) {
            return sendResponse(req, res, 404, 'Job posting not found');
        }

        return sendResponse(req, res, 200, 'Job posting updated successfully', result.data);
    } catch (error) {
        console.error('Error in updateJobPosting:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to update job posting'
        );
    }
};

const deleteJobPosting = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteJobPostingDb(id);

        if (result.statusCode === 404) {
            return sendResponse(req, res, 404, 'Job posting not found');
        }

        return sendResponse(
            req,
            res,
            200,
            'Job posting deleted successfully'
        );
    } catch (error) {
        console.error('Error in deleteJobPosting:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to delete job posting'
        );
    }
};

const searchJobPostings = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return sendResponse(req, res, 400, 'Search query is required');
        }

        const result = await searchJobPostingsDb(q);
        return sendResponse(
            req,
            res,
            200,
            'Search completed successfully',
            result.data || []
        );
    } catch (error) {
        console.error('Error in searchJobPostings:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to search job postings'
        );
    }
};

module.exports = {
    addJobPosting,
    getAllJobPostings,
    getJobPostingById,
    updateJobPosting,
    deleteJobPosting,
    searchJobPostings
};
