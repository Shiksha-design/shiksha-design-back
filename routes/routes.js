const express = require('express');
const authRoutes = require("../routes/auth/authRoutes");
const topFeaturesRoutes = require("../routes/topFeatures/topFeaturesRoutes");
const categoryRoutes = require("../routes/category/categoryRoutes");
const programRoutes = require("../routes/program/programRoutes");
const companyRoutes = require("../routes/company/companyRoutes");
const { authMiddleware } = require('../middlewares/authMiddleware');
const careerRoutes = require("../routes/career/careerRoutes");
const staticPageRoutes = require("../routes/staticPage/staticPageRoutes");
const teamMemberRoutes = require("../routes/teamMembers/teamMemberRoutes");
const faqRoutes = require("./faq/faqRoutes");
const contactusRoutes = require("./contactus/contactusRoutes");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/topFeatures', authMiddleware, topFeaturesRoutes);
router.use('/category', authMiddleware, categoryRoutes);
router.use('/program', authMiddleware, programRoutes);
router.use('/company', authMiddleware, companyRoutes);
router.use('/career', authMiddleware, careerRoutes);
router.use('/staticPages', authMiddleware, staticPageRoutes);
router.use('/contactus', authMiddleware, contactusRoutes);
router.use('/teamMember', authMiddleware, teamMemberRoutes);
router.use('/faq', authMiddleware, faqRoutes);
module.exports = router;