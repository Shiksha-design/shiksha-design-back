const { Responses } = require("../../utils/responses");
const StaticPage = require("../../models/staticPageModel");

// Create or update a static page
const createOrUpdateStaticPage = async (pageData) => {
    try {
        const { pageType } = pageData;

        // Check if page with this type already exists
        const existingPage = await StaticPage.findOne({ pageType });
        
        let result;
        if (existingPage) {
            // Update existing page
            result = await StaticPage.findOneAndUpdate(
                { pageType },
                { $set: pageData },
                { new: true, runValidators: true }
            );
        } else {
            // Create new page
            const newPage = new StaticPage(pageData);
            result = await newPage.save();
        }

        return { 
            ...Responses.success, 
            data: result,
            message: existingPage ? 'Page updated successfully' : 'Page created successfully'
        };
    } catch (error) {
        console.error('Error in createOrUpdateStaticPage:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

// Get static page by type
const getStaticPageByType = async (pageType) => {
    try {
        const page = await StaticPage.findOne({ pageType, isActive: true });
        if (!page) {
            return []
        }
        return page;
    } catch (error) {
        console.error('Error in getStaticPageByType:', error);
        return [];
    }
};

// Get all static pages
const getAllStaticPages = async () => {
    try {
        const pages = await StaticPage.find({ isActive: true });
        return { ...Responses.success, data: pages };
    } catch (error) {
        console.error('Error in getAllStaticPages:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

// Delete a static page (soft delete)
const deleteStaticPage = async (pageType) => {
    try {
        const result = await StaticPage.findOneAndUpdate(
            { pageType },
            { isActive: false },
            { new: true }
        );

        if (!result) {
            return { ...Responses.notFound, message: 'Page not found' };
        }

        return { 
            ...Responses.success, 
            message: 'Page deleted successfully',
            data: result
        };
    } catch (error) {
        console.error('Error in deleteStaticPage:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

module.exports = {
    createOrUpdateStaticPage,
    getStaticPageByType,
    getAllStaticPages,
    deleteStaticPage
};
