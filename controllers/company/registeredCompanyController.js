const { createCompanyDb, getCompanyDetailsDb, updateCompanyDetailsDb } = require('../../db/contactus/contactus');
const { sendResponse } = require('../../utils/sendResponse');

// POST /api/company/register
const registerCompany = async (req, res) => {
    try {
        const { address, email, phoneNumber } = req.body;

        // Validate required fields
        if (!email || !phoneNumber || !address) {
            return sendResponse(req, res, 400, 'Email, phone number, and address are required');
        }

        const result = await createCompanyDb({ address, email, phoneNumber });

        return sendResponse(
            req,
            res,
            result.statusCode || 201,
            result.message || 'Company registered successfully',
            result.data
        );
    } catch (error) {
        console.error('Error in registerCompany:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to register company',
            { error: error.message }
        );
    }
};

// GET /api/company/registered
const getRegisteredCompany = async (req, res) => {
    try {
        const result = await getCompanyDetailsDb();

        if (result.length === 0) {
            return sendResponse(req, res, 404, 'No registered company found');
        }

        return sendResponse(req, res, 200, result);
    } catch (error) {
        console.error('Error in getRegisteredCompany:', error);
        return sendResponse(req, res, 500, 'Failed to retrieve company details', { error: error.message });
    }
};

// PUT /api/company/registered
const updateRegisteredCompany = async (req, res) => {
    try {
        const { address, email, phoneNumber } = req.body;

        // Validate required fields
        if (!email || !phoneNumber || !address) {
            return sendResponse(req, res, 400, 'Email, phone number, and address are required');
        }

        // Since there's only one record, we'll get it first to update
        const existingCompany = await getCompanyDetailsDb();

        if (!existingCompany || existingCompany.statusCode === 404) {
            // If no company exists, create a new one
            const createResult = await createCompanyDb({ address, email, phoneNumber });
            if (createResult.statusCode !== 201) {
                return sendResponse(
                    req,
                    res,
                    createResult.statusCode || 500,
                    createResult.message || 'Failed to create company',
                    createResult.data
                );
            }
            return sendResponse(
                req,
                res,
                200,
                'Company details created successfully',
                createResult.data
            );
        }

        // Update the existing company
        const updateData = { address, email, phoneNumber };
        const result = await updateCompanyDetailsDb(existingCompany.data._id, updateData);

        if (result.statusCode === 409) {
            return sendResponse(req, res, 409, result.message || 'Email already in use');
        }

        return sendResponse(
            req,
            res,
            200,
            'Company details updated successfully',
            result.data
        );
    } catch (error) {
        console.error('Error in updateRegisteredCompany:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to update company details',
            { error: error.message }
        );
    }
};

module.exports = {
    registerCompany,
    getRegisteredCompany,
    updateRegisteredCompany
};
