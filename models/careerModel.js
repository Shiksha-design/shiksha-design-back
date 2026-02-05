const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
    // Job Information
    jobRole: { type: String, required: true, trim: true },
    jobType: { type: String, required: true, enum: ['Full Time', 'Part Time', 'Contract', 'Internship'], trim: true },
    jobLocation: { type: String, required: true, enum: ['On-site', 'Remote', 'Hybrid'], trim: true },
    jobDescription: { type: String, required: true, trim: true },

    // Job Details
    responsibilities: [{ type: String, required: true }],
    requirements: [{ type: String, required: true }],

    // Media
    image: {
        publicId: { type: String, default: '' },
        url: { type: String, default: '' }
    },
    isVisible: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add text index for search functionality
jobPostingSchema.index({
    jobRole: 'text',
    jobDescription: 'text',
    'responsibilities': 'text',
    'requirements': 'text'
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;
