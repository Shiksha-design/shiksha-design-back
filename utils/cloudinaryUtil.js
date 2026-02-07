const cloudinary = require('../config/cloudinary');

/**
 * Normalize req.files (single or multiple)
 */
const normalizeFiles = (files) => {
    if (!files) return [];
    return Array.isArray(files) ? files : [files];
};

/**
 * Upload / Update Images
 * - If oldImages provided → deletes them first
 * - Supports single & multiple images
 */
const uploadOrUpdateImages = async ({
    files,
    oldImages = null,
    folder = 'jobs'
}) => {
    const normalizedFiles = normalizeFiles(files);

    // Delete old images if updating
    if (oldImages) {
        await deleteImages(oldImages);
    }

    const uploadedImages = [];

    for (const file of normalizedFiles) {
        let fileInfo = {
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size
        };
        // If multer-storage-cloudinary is used
        if (file.public_id && file.secure_url) {
            uploadedImages.push({
                ...fileInfo,
                publicId: file.public_id,
                url: file.secure_url,
            });
        }
        // If local storage (disk)
        else if (file.path) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder,
            });

            uploadedImages.push({
                ...fileInfo,
                publicId: result.public_id,
                url: result.secure_url,
            });
        }
    }

    // Return single object or array automatically
    return uploadedImages.length === 1 ? uploadedImages[0] : uploadedImages;
};

/**
 * Delete Images
 * - Accepts single image or array
 */
const deleteImages = async (images) => {
    if (!images) return;

    const imagesArray = Array.isArray(images) ? images : [images];

    for (const img of imagesArray) {
        if (img?.publicId) {
            await cloudinary.uploader.destroy(img.publicId);
        }
    }
};

module.exports = {
    uploadOrUpdateImages,
    deleteImages,
};
