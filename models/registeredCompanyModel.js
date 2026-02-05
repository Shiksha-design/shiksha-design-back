const mongoose = require('mongoose');

const registeredCompanySchema = new mongoose.Schema({
    address: { type: String, required: true },
    email: {type: String, required: true },
    phoneNumber: {type: String, required: true },
    create: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
    delete: { type: Boolean, default: false },
});

const registeredCompany = mongoose.model('registeredCompany', registeredCompanySchema);

module.exports = registeredCompany;
