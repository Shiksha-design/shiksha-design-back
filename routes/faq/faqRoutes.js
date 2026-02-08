// routes/faq/faqRoutes.js
const express = require('express');
const router = express.Router();
const {
    addFaq,
    getFaqsByProgram,
    getFaqById,
    updateFaq,
    deleteFaq
} = require('../../controllers/faq/faqController');

router.post('/', addFaq);
router.get('/program/:programId', getFaqsByProgram);
router.get('/:id', getFaqById);
router.put('/:id', updateFaq);
router.delete('/:id', deleteFaq);

module.exports = router;