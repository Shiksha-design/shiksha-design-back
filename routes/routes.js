
const express = require('express');
const authRoutes = require("../routes/auth/authRoutes");
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/auth', authRoutes);

module.exports = router;