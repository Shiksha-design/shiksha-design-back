const {
  getAllProgramDB,
  getProgramByIdDB,
  createProgramDB,
  updateProgramByIdDB,
  deleteProgramByIdDB
} = require('../../db/program/program');
const { uploadOrUpdateImages } = require('../../utils/cloudinaryUtil');
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
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    if (!req.body.name || !req.body.description || !req.body.duration || !req.body.categoryId || !req.body.startDate) {
      return sendResponse(req, res, 400, "Missing required fields: name, description, duration, startDate, and categoryId are required");
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadOrUpdateImages({
        files: req.files,
        folder: 'job-postings'
      });
    }

    const programData = {
      name: req.body.name,
      description: req.body.description,
      duration: req.body.duration,
      startDate: new Date(req.body.startDate),
      categoryId: req.body.categoryId,
      isBestSeller: req.body.isBestSeller === 'true' || req.body.isBestSeller === true,
      images: Array.isArray(images) ? images : [images]
    };

    const response = await createProgramDB(programData);

    if (!response) {
      throw new Error('No response from database');
    }

    return sendResponse(req, res, response.statusCode || 201, response.clientMessage || 'Program created successfully', response.data);
  } catch (error) {
    console.error('Error in createProgramData:', error);
    return sendResponse(
      req,
      res,
      error.statusCode || 500,
      error.clientMessage || 'Failed to create program',
      { error: error.message }
    );
  }
};

// In updateProgramDataById function
const updateProgramDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Get the existing program
    const existingProgram = await getProgramByIdDB(id);
    if (!existingProgram) {
      return sendResponse(req, res, 404, 'Program not found');
    }

    console.log('Update request body:', payload);
    console.log('Uploaded files:', req.files);

    let images = [];
    if (req.files && req.files.length > 0) {
      images = await uploadOrUpdateImages({
        files: req.files,
        oldImages: existingProgram.images,
        folder: 'job-postings'
      });
    }

    // 5. Update the program
    const updateProgramData = {
      name: payload.name,
      description: payload.description,
      duration: payload.duration,
      startDate: payload.startDate ? new Date(payload.startDate) : existingProgram.startDate,
      categoryId: payload.categoryId,
      isBestSeller: payload.isBestSeller === 'true' || payload.isBestSeller === true,
      images: Array.isArray(images) ? images : [images],
    };

    console.log('Updating program with data:', updateProgramData);
    const response = await updateProgramByIdDB(id, updateProgramData);

    if (!response) {
      throw new Error('No response from database');
    }

    return sendResponse(
      req,
      res,
      response.statusCode || 200,
      response.clientMessage || 'Program updated successfully',
      response.data
    );
  } catch (error) {
    console.error('Error in updateProgramDataById:', error);
    return sendResponse(
      req,
      res,
      error.statusCode || 500,
      error.clientMessage || 'Failed to update program',
      { error: error.message }
    );
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
