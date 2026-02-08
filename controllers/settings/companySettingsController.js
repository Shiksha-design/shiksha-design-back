const CompanySettings = require('../../models/companySettingsModel');
const { Responses } = require('../../utils/responses');

// Get company settings
const getCompanySettings = async (req, res) => {
    try {
        // Since there's only one settings document, we'll use findOne
        const settings = await CompanySettings.findOne();
        
        if (!settings) {
            // If no settings exist, return default settings
            return res.status(200).json({
                ...Responses.success,
                data: {
                    company: {
                        address: '',
                        email: '',
                        phoneNumber: ''
                    },
                    aboutUs: {
                        description: '',
                        image: {}
                    },
                    pages: {
                        privacyPolicy: { title: '', description: '', image: {} },
                        termsAndConditions: { title: '', description: '', image: {} },
                        contactInfo: { title: '', description: '', image: {} },
                        refundPolicy: { title: '', description: '', image: {}}
                    }
                }
            });
        }

        res.status(200).json({
            ...Responses.success,
            data: settings
        });
    } catch (error) {
        console.error('Error getting company settings:', error);
        res.status(500).json(Responses.serverError);
    }
};

// Update company settings
const updateCompanySettings = async (req, res) => {
    try {
        const updateData = req.body;
        
        // Find the settings document or create a new one if it doesn't exist
        const settings = await CompanySettings.findOneAndUpdate(
            {},
            updateData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            ...Responses.success,
            message: 'Company settings updated successfully',
            data: settings
        });
    } catch (error) {
        console.error('Error updating company settings:', error);
        res.status(500).json(Responses.serverError);
    }
};

// Update specific section of company settings
const updateSectionSettings = async (req, res) => {
    try {
        const { section } = req.params;
        const updateData = req.body;
        
        // Validate section
        const validSections = ['company', 'aboutUs', 'pages.privacyPolicy', 'pages.termsAndConditions', 
                             'pages.contactInfo', 'pages.refundPolicy'];
        if (!validSections.includes(section)) {
            return res.status(400).json({
                ...Responses.badRequest,
                message: 'Invalid section specified'
            });
        }

        const updateObj = {};
        updateObj[section] = updateData;

        const settings = await CompanySettings.findOneAndUpdate(
            {},
            { $set: updateObj },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({
            ...Responses.success,
            message: `${section} settings updated successfully`,
            data: settings
        });
    } catch (error) {
        console.error(`Error updating ${section} settings:`, error);
        res.status(500).json(Responses.serverError);
    }
};

module.exports = {
    getCompanySettings,
    updateCompanySettings,
    updateSectionSettings
};
