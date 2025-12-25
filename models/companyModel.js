const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description : { type: String, required: false },
    logoPath : { type: String, required: false },
    isVisible: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

const company = mongoose.model('company', companySchema);

module.exports = company;
