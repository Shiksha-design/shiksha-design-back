// models/faqModel.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;