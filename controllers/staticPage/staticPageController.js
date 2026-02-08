const {
    createOrUpdateStaticPage,
    getStaticPageByType,
    getAllStaticPages,
    deleteStaticPage
} = require('../../db/staticPage/staticPageDb');
const { sendResponse } = require('../../utils/sendResponse');
const { uploadOrUpdateImages, uploadOrUpdateVideos } = require('../../utils/cloudinaryUtil');

// Create or update a static page
const createUpdatePage = async (req, res) => {
    try {
        const { pageType } = req.body;

        if (!pageType) {
            return sendResponse(req, res, 400, 'Page type is required');
        }

        // Validate page type
        const validPageTypes = ['COMPANY_DETAILS', 'ABOUT_US', 'PRIVACY_POLICY', 'TERMS', 'REFUND_POLICY'];
        if (!validPageTypes.includes(pageType)) {
            return sendResponse(req, res, 400, 'Invalid page type');
        }

        // Common required fields for all page types
        const requiredFields = [];

        // Page type specific validations
        switch (pageType) {
            case 'ABOUT_US':
                requiredFields.push('title', 'description');
                if (req.files && req.files.length > 0) {
                    const aboutUsDetails = await getStaticPageByType('ABOUT_US');

                    let options = {
                        files: req.files,
                        folder: 'common'
                    }
                    if (aboutUsDetails.length !== 0) {
                        options.oldImages = aboutUsDetails.images;
                    }
                    const images = await uploadOrUpdateImages(options);
                    req.body.images = images;
                } else if (!req.body.images) {
                    // If no new files and no existing images
                    return sendResponse(req, res, 400, 'Image is required for About Us page');
                }
                break;

            case 'COMPANY_DETAILS':
                requiredFields.push('name', 'address', 'email', 'phoneNumber');
                if (req.files && req.files.length > 0) {
                    const contactUsDetails = await getStaticPageByType('CONTACT_US');

                    let options = {
                        files: req.files,
                        folder: 'common'
                    }
                    if (contactUsDetails.length !== 0) {
                        options.oldImages = contactUsDetails.images;
                    }
                    const images = await uploadOrUpdateImages(options);
                    req.body.images = images;
                } else if (!req.body.images) {
                    // If no new files and no existing images
                    return sendResponse(req, res, 400, 'Image is required for Contact Us page');
                }
                break;

            case 'PRIVACY_POLICY':
            case 'TERMS':
            case 'REFUND_POLICY':
                requiredFields.push('title', 'content');
                break;
        }

        // Check for missing required fields
        const missingFields = requiredFields.filter(field => !req.body[field]);
        if (missingFields.length > 0) {
            return sendResponse(req, res, 400, `Missing required fields for ${pageType}: ${missingFields.join(', ')}`);
        }

        const result = await createOrUpdateStaticPage(req.body);

        return sendResponse(req, res, result.statusCode || 200, result.clientMessage, result.data);
    } catch (error) {
        console.error('Error in createUpdatePage:', error);
        return sendResponse(req, res,
            500,
            'Failed to process request',
            { error: error.message }
        );
    }
};

const uploadAboutUsVideo = async (req, res) => {
    try {
        if (!req.file || req.file.length === 0) {
            return sendResponse(req, res, 400, 'No video file provided');
        }

        if (req.body.pageType !== 'ABOUT_US') {
            return sendResponse(req, res, 400, 'Invalid page type');
        }

        // Get existing about page data
        const existingPage = await getStaticPageByType('ABOUT_US');
        const pageId = existingPage?._id;

        // Check if the uploaded file is a video
        const videoFile = req.file;
        if (!videoFile) {
            return sendResponse(req, res, 400, 'Please upload a valid video file');
        }

        // Upload the video to Cloudinary
        const videoOptions = {
            files: [videoFile],
            folder: 'common',
            oldVideos: existingPage?.video ? [existingPage.video] : null
        };

        const [uploadedVideo] = await uploadOrUpdateVideos(videoOptions);

        // Update the about page with the new video
        const updateData = {
            video: uploadedVideo,
            update: Date.now()
        };

        let result;
        if (pageId) {
            // Update existing page
            result = await StaticPage.findByIdAndUpdate(
                pageId,
                { $set: updateData },
                { new: true }
            );
        } else {
            // Create new about page with video
            const newPage = new StaticPage({
                pageType: 'ABOUT_US',
                ...updateData
            });
            result = await newPage.save();
        }

        return sendResponse(req, res, 200, 'About page video updated successfully');

    } catch (error) {
        console.error('Error in uploadAboutVideo:', error);
        return sendResponse(req, res, 500, 'Failed to upload video');
    }
};

// Get page by type
const getPageByType = async (req, res) => {
    try {
        const { pageType } = req.params;

        if (!pageType) {
            return sendResponse(req, res, 400, 'Page type is required');
        }

        const result = await getStaticPageByType(pageType);

        if (result.statusCode === 404) {
            const defaultData = {
                pageType,
                title: '',
                description: '',
                image: {},
                email: '',
                phoneNumber: '',
                address: ''
            };
            return sendResponse(req, res, 200, 'Page data', defaultData);
        }

        return sendResponse(req, res, result.statusCode || 200, result);
    } catch (error) {
        console.error('Error in getPageByType:', error);
        return sendResponse(req, res, 500, 'Failed to retrieve page', { error: error.message });
    }
};

// Get all pages
const getAllPages = async (req, res) => {
    try {
        const result = await getAllStaticPages();

        return sendResponse(
            req,
            res,
            result.statusCode || 200,
            'Pages retrieved successfully',
            result.data || []
        );
    } catch (error) {
        console.error('Error in getAllPages:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to retrieve pages',
            { error: error.message }
        );
    }
};

// Delete a page (soft delete)
const deletePage = async (req, res) => {
    try {
        const { pageType } = req.params;

        if (!pageType) {
            return sendResponse(req, res, 400, 'Page type is required');
        }

        const result = await deleteStaticPage(pageType);

        return sendResponse(
            req,
            res,
            result.statusCode || 200,
            result.message || 'Page deleted successfully',
            result.data
        );
    } catch (error) {
        console.error('Error in deletePage:', error);
        return sendResponse(
            req,
            res,
            500,
            'Failed to delete page',
            { error: error.message }
        );
    }
};

module.exports = {
    createUpdatePage,
    getPageByType,
    getAllPages,
    deletePage,
    uploadAboutUsVideo
};
