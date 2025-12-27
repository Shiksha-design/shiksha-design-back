const {
  getAllCompanyDB,
  getCompanyByIdDB,
  createCompanyDB,
  updateCompanyByIdDB,
  deleteCompanyByIdDB
} = require('../../db/company/company');

const { sendResponse } = require('../../utils/sendResponse');

// GET /api/company
const getAllCompanyData = async (req, res) => {
  try {
    const data = await getAllCompanyDB();
    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data");
  }
};

// GET /api/company/:id
const getCompanyDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getCompanyByIdDB(id);

    if (!data) {
      return sendResponse(req, res, 404, "Data not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to fetch data by ID");
  }
};

// POST /api/company
const createCompanyData = async (req, res) => {
  try {
    const payload = req.body;
    const companyData = {
      name : payload.name,
      description : payload.description,
      fileDetails : req?.file,
      isVisible : payload.isVisible || false,
    }
    const response = await createCompanyDB(companyData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to create data");
  }
};

// PUT /api/company/:id
const updateCompanyDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updatedCompanyData = {
      name : payload.name,
      description : payload.description,
      fileDetails : req?.file,
      isVisible : payload.isVisible || false,
    }
    const response = await updateCompanyByIdDB(id, updatedCompanyData);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to update data");
  }
};

// DELETE /api/company/:id
const deleteCompanyDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteCompanyByIdDB(id);
    return sendResponse(req, res, response.statusCode, response.clientMessage);
  } catch (error) {
    return sendResponse(req, res, 500, "Failed to delete data");
  }
};

module.exports = {
  getAllCompanyData,
  getCompanyDataById,
  createCompanyData,
  updateCompanyDataById,
  deleteCompanyDataById
};
