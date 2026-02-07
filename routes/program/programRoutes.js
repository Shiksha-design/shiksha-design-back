const express = require('express');
const router = express.Router();
const programController = require('../../controllers/program/programController');
const { uploadProgramImages } = require('../../middlewares/uploadMiddleware');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Public routes
router.get('/', programController.getAllProgramData);
router.get('/:id', programController.getProgramDataById);

// Create program route with file uploads
router.post('/create', uploadProgramImages, programController.createProgramData);

// Other routes
router.put('/:id', uploadProgramImages, programController.updateProgramDataById);
router.delete('/:id', programController.deleteProgramDataById);

// Error handling middleware for file uploads
router.use((err, req, res, next) => {
    if (err) {
        console.error('Route error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    next();
});

module.exports = router;