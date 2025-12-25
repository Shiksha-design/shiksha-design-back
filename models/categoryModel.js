const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    sequence: { type: Number, required: true, unique: true },
    isVisible: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

const category = mongoose.model('category', categorySchema);

module.exports = category;
