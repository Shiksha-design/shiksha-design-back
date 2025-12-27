const mongoose = require("mongoose");

const TopFeatureSchema = new mongoose.Schema(
    {
        value: { type: String, default: "", required: true },
        isVisible: { type: Boolean, default: true, required: true },
        fileDetails: {
            filePath: { type: String, required: false },
            fileName: { type: String, required: false },
            originalName: { type: String, required: false },
            size: { type: Number, required: false },
            mimeType: { type: String, required: false }
        },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);

const TopFeatures = mongoose.model('topFeature', TopFeatureSchema);

module.exports = TopFeatures;