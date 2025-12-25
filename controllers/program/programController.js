const {
  getAllProgramDB,
  getProgramByIdDB,
  createProgramDB,
  updateProgramByIdDB,
  deleteProgramByIdDB
} = require('../../db/program/program');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/program
const getAllProgramData = async (req, res) => {
  try {
    const data = await getAllProgramDB();
    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data");
  }
};

// GET /api/program/:id
const getProgramDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getProgramByIdDB(id);

    if (!data) {
      return sendResponse(req, res, 404, "Data not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data by ID");
  }
};

// POST /api/program
const createProgramData = async (req, res) => {
  try {
    const payload = req.body;
    const programData = {
      name: payload.name,
      description: payload.description,
      duration: payload.duration,
      categoryId: payload.categoryId,
      isBestSeller: payload.isBestSeller || false,
    }
    const response = await createProgramDB(programData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to create data");
  }
};

// PUT /api/program/:id
const updateProgramDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updateProgramData = {
      name: payload.name,
      description: payload.descriptiproon,
      duration: payload.duration,
      categoryId: payload.categoryId,
      isBestSeller: payload.isBestSeller || false,
    }
    const response = await updateProgramByIdDB(id, updateProgramData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update data");
  }
};

// DELETE /api/program/:id
const deleteProgramDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteProgramByIdDB(id);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete data");
  }
};

module.exports = {
  getAllProgramData,
  getProgramDataById,
  createProgramData,
  updateProgramDataById,
  deleteProgramDataById
};
