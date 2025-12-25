const mongoose = require("mongoose");

const TopFeatureSchema = new mongoose.Schema(
    {
        iconName: { type: String, required: false },
        iconPath: { type: String, required: false },
        value: { type: String, default: "", required: true },
        isVisible: { type: Boolean, default: true, required: true },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date }
    },
    { timestamps: true }
);

const TopFeatures = mongoose.model('topFeature', TopFeatureSchema);

module.exports = TopFeatures;