const express = require('express');
const authRoutes = require("../routes/auth/authRoutes");
const topFeaturesRoutes = require("../routes/topFeatures/topFeaturesRoutes");
const categoryRoutes = require("../routes/category/categoryRoutes");
const programRoutes = require("../routes/program/programRoutes");
const companyRoutes = require("../routes/company/companyRoutes");
const contactusRoutes = require("../routes/contactus/consactusRoutes");
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadSingle, uploadMultiple } = require('../middlewares/multerConfig');
const careerRoutes = require("../routes/career/careerRoutes");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/topFeatures', authMiddleware, topFeaturesRoutes);
router.use('/category', authMiddleware, categoryRoutes);
router.use('/program', authMiddleware, programRoutes);
router.use('/company', authMiddleware, companyRoutes);
router.use('/contactus', authMiddleware, contactusRoutes);
router.use('/career', authMiddleware, careerRoutes);

module.exports = router;