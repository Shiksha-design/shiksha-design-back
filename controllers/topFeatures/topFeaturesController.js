const {
  getAllTopFeaturesDB,
  getTopFeaturesByIdDB,
  createTopFeaturesDB,
  updateTopFeaturesByIdDB,
  deleteTopFeaturesByIdDB
} = require('../../db/topFeatures/topFeatures');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/topFeatures
const getAllTopFeaturesData = async (req, res) => {
  try {
    const data = await getAllTopFeaturesDB();
    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data");
  }
};

// GET /api/topFeatures/:id
const getTopFeaturesDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getTopFeaturesByIdDB(id);

    if (!data) {
      return sendResponse(req, res, 404, "Data not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data by ID");
  }
};

// POST /api/topFeatures
const createTopFeaturesData = async (req, res) => {
  try {
    const payload = req.body;
    const topFeatureData = {
      fileDetails: req?.file,
      value: payload.value,
      isVisible: payload.isVisible,
    }
    const response = await createTopFeaturesDB(topFeatureData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to create data");
  }
};

// PUT /api/topFeatures/:id
const updateTopFeaturesDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updateTopFeatureData = {
      fileDetails: req?.file,
      value: payload?.value,
      isVisible: payload?.isVisible,
    }
    const response = await updateTopFeaturesByIdDB(id, updateTopFeatureData);
    return sendResponse(req, res, response.statusCode, response.message);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update data");
  }
};

// DELETE /api/topFeatures/:id
const deleteTopFeaturesDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteTopFeaturesByIdDB(id);
    return sendResponse(req, res, response.statusCode, "Category Deleted Successfully");
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete data");
  }
};

module.exports = {
  getAllTopFeaturesData,
  getTopFeaturesDataById,
  createTopFeaturesData,
  updateTopFeaturesDataById,
  deleteTopFeaturesDataById
};
