const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');  // Add this line to import the path module
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for videos
const videoFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Only video files are allowed!'), false);
    }
};
// Create upload middleware
const uploadVideo = multer({
    storage: storage,
    fileFilter: videoFileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    }
});

const createUploadMiddleware = (options = {}) => {
    const {
        maxFiles = 5,
        folder = 'uploads',
        allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'avi'],
        maxFileSize = 5 * 1024 * 1024 // 5MB default
    } = options;

    // Configure Cloudinary storage with dynamic folder
    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: (req, file) => {
            return {
                folder: folder,
                allowed_formats: allowedFormats,
                transformation: [{ quality: 'auto' }],
                public_id: `${folder}-${Date.now()}-${file.originalname.split('.')[0]}`
            };
        }
    });

    // File filter
    const fileFilter = (req, file, cb) => {
        const mimeTypes = allowedFormats.map(format => `image/${format === 'jpg' ? 'jpeg' : format}`);
        if (mimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type. Only ${allowedFormats.join(', ')} files are allowed.`), false);
        }
    };

    // Configure multer
    const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: maxFileSize,
            files: maxFiles
        }
    });

    // Return middleware function
    return (req, res, next) => {
        upload.array('images', maxFiles)(req, res, (err) => {
            if (err) {
                return handleUploadErrors(err, req, res, next);
            }

            if (!req.body.images && req.files) {
                req.body.images = req.files;
            }

            next();
        });
    };
};

// Create specific middleware instances
const uploadProgramImages = createUploadMiddleware({
    maxFiles: 5,
    folder: 'programs',
    maxFileSize: 5 * 1024 * 1024 // 5MB
});

const uploadContactUsImages = createUploadMiddleware({
    maxFiles: 1,
    folder: 'contactus',
    maxFileSize: 5 * 1024 * 1024 // 5MB
});

const uploadCareerImages = createUploadMiddleware({
    maxFiles: 1,  // Different limit for career
    folder: 'careers',
    maxFileSize: 1 * 1024 * 1024 // 3MB
});

const uploadTeamMemberImages = createUploadMiddleware({
    maxFiles: 1,  // Different limit for career
    folder: 'teamMembers',
    maxFileSize: 1 * 1024 * 1024 // 3MB
});

module.exports = {
    uploadProgramImages,
    uploadContactUsImages,
    uploadCareerImages,
    uploadTeamMemberImages,
    uploadVideo
};