// db/faq/faq.js
const { Responses } = require("../../utils/responses");
const FAQ = require("../../models/faqModel");

const addFaqDb = async (faqData) => {
    try {
        const faq = new FAQ(faqData);
        await faq.save();
        return { ...Responses.success, data: faq };
    } catch (error) {
        console.error('Error creating FAQ:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const getFaqsByProgramDb = async (programId) => {
    try {
        const faqs = await FAQ.find({ 
            programId, 
            isDeleted: false 
        }).sort({ createdAt: -1 });
        return faqs;
    } catch (error) {
        console.error('Error getting FAQs:', error);
        return [];
    }
};

const getFaqByIdDb = async (id) => {
    try {
        const faq = await FAQ.findOne({ _id: id, isDeleted: false });
        return faq || null;
    } catch (error) {
        console.error('Error getting FAQ by ID:', error);
        return null;
    }
};

const updateFaqDb = async (id, updateData) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!faq) {
            return Responses.notFound;
        }

        return { ...Responses.success, data: faq };
    } catch (error) {
        console.error('Error updating FAQ:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

const deleteFaqDb = async (id) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(
            id,
            { 
                isDeleted: true, 
                deletedAt: Date.now() 
            },
            { new: true }
        );

        if (!faq) {
            return Responses.notFound;
        }

        return Responses.success;
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return { ...Responses.serverError, error: error.message };
    }
};

module.exports = {
    addFaqDb,
    getFaqsByProgramDb,
    getFaqByIdDb,
    updateFaqDb,
    deleteFaqDb
};