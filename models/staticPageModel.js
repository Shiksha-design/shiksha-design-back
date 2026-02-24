const mongoose = require('mongoose');

const imageSchema = {
    filename: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    size: { type: Number, default: 0 },
    publicId: { type: String, default: '' },
    url: { type: String, default: '' }
};

const staticPageSchema = new mongoose.Schema({
    // page identity
    pageType: {
        type: String,
        required: true,
        enum: [
            'COMPANY_DETAILS',
            'ABOUT_US',
            'PRIVACY_POLICY',
            'TERMS',
            'REFUND_POLICY'
        ],
        unique: true
    },

    // about us fields
    title: String,
    description: String,

    //common fields
    images: imageSchema,
    videos: imageSchema,

    // contact page specific fields
    email: String,
    phoneNumber: String,
    address: String,


    isActive: { type: Boolean, default: true },

}, {
    timestamps: true
});

module.exports = mongoose.model('StaticPage', staticPageSchema);
