const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage for company images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        return {
            folder: 'companies',  // Store company images in a separate folder
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ quality: 'auto' }],
            public_id: `company-${Date.now()}-${file.originalname.split('.')[0]}`
        };
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpg, jpeg, png, and webp files are allowed.'), false);
    }
};

// Configure multer with the storage and file filter
const uploadCompanyImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
}).single('companyImage');  // Single file upload with field name 'companyImage'

// Middleware to handle file upload
const handleCompanyImageUpload = (req, res, next) => {
    uploadCompanyImage(req, res, (err) => {
        if (err) {
            console.error('File upload error:', err);
            return handleUploadErrors(err, req, res, next);
        }
        next();
    });
};

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false,
                message: 'File size too large. Maximum 5MB per file.' 
            });
        }
        return res.status(400).json({ 
            success: false,
            message: err.message 
        });
    } else if (err) {
        console.error('Upload error:', err);
        return res.status(500).json({ 
            success: false,
            message: 'Error processing file upload',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    next();
};

module.exports = { 
    uploadCompanyImage,
    handleCompanyImageUpload,
    handleUploadErrors
};
