// routes/faq/faqRoutes.js
const express = require('express');
const router = express.Router();
const {
    contactAdmin
} = require('../../controllers/contactus/contactusController');

router.post('/', contactAdmin);

module.exports = router;