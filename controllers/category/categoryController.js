const {
  getAllCategoryDB,
  getCategoryByIdDB,
  createCategoryDB,
  updateCategoryByIdDB,
  deleteCategoryByIdDB
} = require('../../db/category/category');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/category
const getAllCategoryData = async (req, res) => {
  try {
    const data = await getAllCategoryDB();
    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data");
  }
};

// GET /api/category/:id
const getCategoryDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getCategoryByIdDB(id);

    if (!data) {
      return sendResponse(req, res, 404, "Data not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data by ID");
  }
};

// POST /api/category
const createCategoryData = async (req, res) => {
  try {
    const payload = req.body;
    const categoryData = {
      name: payload.name,
      sequence: payload.sequence,
    }
    const response = await createCategoryDB(categoryData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to create data");
  }
};

// PUT /api/category/:id
const updateCategoryDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const categoryData = {
      name: payload.name,
      sequence: payload.sequence,
    }
   const response =  await updateCategoryByIdDB(id, categoryData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update data");
  }
};

// DELETE /api/category/:id
const deleteCategoryDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const responses = await deleteCategoryByIdDB(id);
    return sendResponse(req, res, responses.statusCode, responses.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete data");
  }
};

module.exports = {
  getAllCategoryData,
  getCategoryDataById,
  createCategoryData,
  updateCategoryDataById,
  deleteCategoryDataById
};
