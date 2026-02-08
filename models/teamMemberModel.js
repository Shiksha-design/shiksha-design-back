const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    description: { type: String, required: true },
    images: {
        filename: { type: String, default: '' },
        mimetype: { type: String, default: '' },
        size: { type: Number, default: 0 },
        publicId: { type: String, default: '' },
        url: { type: String, default: '' } 
    },
    create: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
    delete: { type: Boolean, default: false },
});

const user = mongoose.model('teamMember', teamMemberSchema);

module.exports = user;
