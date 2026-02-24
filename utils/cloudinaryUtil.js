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

const uploadOrUpdateVideos = async ({ files, folder, oldVideos = null }) => {
    try {
        // Normalize files to array
        const normalizedFiles = Array.isArray(files) ? files : [files];
        
        // Delete old videos if they exist
        if (oldVideos && oldVideos.length > 0) {
            await Promise.all(
                oldVideos.map(video => {
                    if (video && video.publicId) {
                        return cloudinary.uploader.destroy(video.publicId, {
                            resource_type: 'video'
                        });
                    }
                })
            );
        }

        // Upload new videos
        const uploadPromises = normalizedFiles.map(file => {
            return new Promise((resolve, reject) => {
                const uploadOptions = {
                    resource_type: 'video',
                    folder: folder,
                    public_id: `${folder}-${Date.now()}-${file.originalname.split('.')[0]}`,
                    chunk_size: 6000000, // 6MB chunks for better handling of large files
                    eager: [
                        { width: 1280, height: 720, crop: 'scale' },
                        { width: 854, height: 480, crop: 'scale' }
                    ]
                };

                // If file has buffer (memory storage)
                if (file.buffer) {
                    const stream = cloudinary.uploader.upload_stream(
                        uploadOptions,
                        (error, result) => {
                            if (error) {
                                console.error('Error uploading video to Cloudinary:', error);
                                return reject(error);
                            }
                            resolve({
                                filename: file.originalname,
                                mimetype: file.mimetype,
                                size: file.size,
                                publicId: result.public_id,
                                url: result.secure_url
                            });
                        }
                    );
                    stream.end(file.buffer);
                }
                // If file has path (disk storage)
                else if (file.path) {
                    cloudinary.uploader.upload(file.path, uploadOptions)
                        .then(result => {
                            resolve({
                                filename: file.originalname,
                                mimetype: file.mimetype,
                                size: file.size,
                                publicId: result.public_id,
                                url: result.secure_url
                            });
                        })
                        .catch(error => {
                            console.error('Error uploading video to Cloudinary:', error);
                            reject(error);
                        });
                }
                else {
                    reject(new Error('File has no buffer or path property'));
                }
            });
        });

        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error in uploadOrUpdateVideos:', error);
        throw error;
    }
};

module.exports = {
    uploadOrUpdateImages,
    deleteImages,
    uploadOrUpdateVideos
};
