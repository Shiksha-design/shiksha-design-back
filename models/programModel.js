const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
    isBestSeller: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
}, {
    timestamps: true
});

const Program = mongoose.model('Program', programSchema);

module.exports = Program;
