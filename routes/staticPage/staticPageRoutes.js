const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../../middlewares/authMiddleware');
const {
    createUpdatePage,
    getPageByType,
    getAllPages,
    deletePage,
    uploadAboutUsVideo
} = require('../../controllers/staticPage/staticPageController');
const { uploadContactUsImages, uploadVideo } = require('../../middlewares/uploadMiddleware');

// Create or update a static page (protected)
router.post('/', uploadContactUsImages, createUpdatePage);

// Get all static pages (public)
router.get('/', getAllPages);

// Get a specific static page by type (public)
router.get('/:pageType', getPageByType);

// Delete a static page (protected)
router.delete('/:pageType', authMiddleware, deletePage);

router.post('/uploadAboutUsVideo', uploadVideo.single('video'), uploadAboutUsVideo);


module.exports = router;
