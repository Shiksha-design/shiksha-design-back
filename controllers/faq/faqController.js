// controllers/faq/faqController.js
const { sendResponse } = require("../../utils/sendResponse");
const {
  addFaqDb,
  getFaqsByProgramDb,
  getFaqByIdDb,
  updateFaqDb,
  deleteFaqDb
} = require("../../db/faq/faq");

const addFaq = async (req, res) => {
  try {
    const { question, answer, programId } = req.body;

    if (!question || !answer || !programId) {
      return sendResponse(req, res, 400, 'Question, answer, and programId are required');
    }

    const result = await addFaqDb({ question, answer, programId });
    return sendResponse(
      req,
      res,
      result.statusCode || 201,
      result.message || 'FAQ added successfully',
      result.data
    );
  } catch (error) {
    console.error('Error in addFaq:', error);
    return sendResponse(req, res, 500, 'Failed to add FAQ');
  }
};

const getFaqsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;
    const faqs = await getFaqsByProgramDb(programId);
    return sendResponse(req, res, 200, faqs);
  } catch (error) {
    console.error('Error in getFaqsByProgram:', error);
    return sendResponse(req, res, 500, 'Failed to retrieve FAQs');
  }
};

const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await getFaqByIdDb(id);

    if (!faq) {
      return sendResponse(req, res, 404, 'FAQ not found');
    }

    return sendResponse(req, res, 200, faq);
  } catch (error) {
    console.error('Error in getFaqById:', error);
    return sendResponse(req, res, 500, 'Failed to retrieve FAQ');
  }
};

const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;

    const updateData = {};
    if (question) updateData.question = question;
    if (answer) updateData.answer = answer;

    if (Object.keys(updateData).length === 0) {
      return sendResponse(req, res, 400, 'No valid fields to update');
    }

    const result = await updateFaqDb(id, updateData);
    return sendResponse(
      req,
      res,
      result.statusCode || 200,
      result.message || 'FAQ updated successfully',
      result.data
    );
  } catch (error) {
    console.error('Error in updateFaq:', error);
    return sendResponse(req, res, 500, 'Failed to update FAQ');
  }
};

const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteFaqDb(id);

    if (result.statusCode === 404) {
      return sendResponse(req, res, 404, 'FAQ not found');
    }

    return sendResponse(
      req,
      res,
      result.statusCode || 200,
      result.message || 'FAQ deleted successfully'
    );
  } catch (error) {
    console.error('Error in deleteFaq:', error);
    return sendResponse(req, res, 500, 'Failed to delete FAQ');
  }
};

module.exports = {
  addFaq,
  getFaqsByProgram,
  getFaqById,
  updateFaq,
  deleteFaq
};