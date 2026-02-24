// models/faqModel.js
const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true },    
    phoneNumber: { type: String, required: true },
    query: { type: String, required: true },
    isAttended: { type : Boolean, required: true, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;