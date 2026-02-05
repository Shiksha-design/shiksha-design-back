const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { 
        type: String, 
        required: true,
        default: 'NALANDA 53/1 C, Manoj Arcade, 24th Main Rd, Sector 2, HSR Layout, Bengaluru - 560102, Karnataka, India.'
    },
    email: { 
        type: String, 
        required: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
    },
    phoneNumber: { 
        type: String, 
        required: true,
        match: [/^[0-9\s+\-()]{10,20}$/, 'Please enter a valid phone number']
    },
    description: { type: String, required: false },
    image: {
        publicId: { type: String },
        url: { type: String }
    },
    isVisible: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

const company = mongoose.model('company', companySchema);

module.exports = company;
