const { Responses } = require("../../utils/responses");
const RegisteredCompany = require("../../models/registeredCompanyModel");

// Create a new company
const createCompanyDb = async (companyData) => {
    try {
        const { email } = companyData;

        // Check if company with email already exists
        const existingCompany = await RegisteredCompany.findOne({ email, delete: false });
        if (existingCompany) {
            return { ...Responses.conflict, message: 'Company with this email already exists' };
        }

        const newCompany = new RegisteredCompany(companyData);
        await newCompany.save();
        return { ...Responses.success, data: newCompany };
    } catch (error) {
        console.error('Error creating company:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

// Get company details by ID
const getCompanyDetailsDb = async (id) => {
    try {
        const company = await RegisteredCompany.findOne({ delete: false });
        if (!company) {
            return Responses.notFound;
        }
        return company;
    } catch (error) {
        console.error('Error getting company by ID:', error);
        return []
    }
};

// Update company
const updateCompanyDetailsDb = async (id, updateData) => {
    try {
        // Prevent updating email to an existing one
        if (updateData.email) {
            const existingCompany = await RegisteredCompany.findOne({
                email: updateData.email,
                _id: { $ne: id },
                delete: false
            });

            if (existingCompany) {
                return { ...Responses.conflict, message: 'Email already in use by another company' };
            }
        }

        const updatedCompany = await RegisteredCompany.findByIdAndUpdate(
            id,
            { ...updateData, update: Date.now() },
            { new: true, runValidators: true }
        );

        if (!updatedCompany) {
            return Responses.notFound;
        }

        return { ...Responses.success, data: updatedCompany };
    } catch (error) {
        console.error('Error updating company:', error);
        return { ...Responses.serverError, error: error.message };
    }
};


module.exports = {
    createCompanyDb,
    getCompanyDetailsDb,
    updateCompanyDetailsDb
};
