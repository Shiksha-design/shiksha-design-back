const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: (req, file) => {
        return {
            folder: 'programs',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [{ quality: 'auto' }],
            public_id: `program-${Date.now()}-${file.originalname.split('.')[0]}`
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
const uploadProgramImages = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per image
        files: 5 // Maximum 5 files
    }
});

// Middleware to handle file uploads and form fields
const handleFileUpload = (req, res, next) => {
    // First, handle any file uploads
    uploadProgramImages.array('images', 5)(req, res, (err) => {
        if (err) {
            console.error('File upload error:', err);
            return handleUploadErrors(err, req, res, next);
        }
        
        // Log the uploaded files and form fields for debugging
        console.log('Uploaded files:', req.files);
        console.log('Form fields:', req.body);
        
        // Ensure the images array exists in the request
        if (!req.body.images && req.files) {
            req.body.images = req.files;
        }
        
        next();
    });
};

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false,
                message: 'File size too large. Maximum 5MB per file.' 
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ 
                success: false,
                message: 'Too many files. Maximum 5 files allowed.' 
            });
        }
        return res.status(400).json({ 
            success: false,
            message: err.message 
        });
    } else if (err) {
        // An unknown error occurred
        console.error('Upload error:', err);
        return res.status(500).json({ 
            success: false,
            message: 'Error processing file upload',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    // No error, proceed to next middleware
    next();
};

module.exports = { 
    uploadProgramImages, 
    handleUploadErrors,
    handleFileUpload 
};
