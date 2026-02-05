const {
  getAllCompanyDB,
  getCompanyByIdDB,
  createCompanyDB,
  updateCompanyByIdDB,
  deleteCompanyByIdDB
} = require('../../db/company/company');
const { cloudinary } = require('../../config/cloudinary');
const { sendResponse } = require('../../utils/sendResponse');

// GET /api/company
const getAllCompanyData = async (req, res) => {
  try {
    const data = await getAllCompanyDB();
    return sendResponse(req, res, 200, data);
  } catch (error) {
    console.error('Error in getAllCompanyData:', error);
    return sendResponse(req, res, 500, "Failed to fetch companies");
  }
};

// GET /api/company/:id
const getCompanyDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getCompanyByIdDB(id);

    if (!data) {
      return sendResponse(req, res, 404, "Company not found");
    }

    return sendResponse(req, res, 200, data);
  } catch (error) {
    console.error('Error in getCompanyDataById:', error);
    return sendResponse(req, res, 500, "Failed to fetch company");
  }
};

// POST /api/company
const createCompanyData = async (req, res) => {
  try {
    const payload = req.body;

    // Handle file upload
    let imageData = null;
    if (req.file) {
      imageData = {
        publicId: req.file.filename,
        url: req.file.path
      };
    }

    // Validate required fields
    if (!payload.email || !payload.phoneNumber || !payload.address) {
      return sendResponse(req, res, 400, 'Email, phone number, and address are required');
    }

    const companyData = {
      name: payload.name,
      address: payload.address,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      description: payload.description,
      image: imageData,
      isVisible: payload.isVisible === 'true' || payload.isVisible === true
    };

    const response = await createCompanyDB(companyData);
    return sendResponse(
      req,
      res,
      response.statusCode || 201,
      response.clientMessage || 'Company created successfully',
      response.data
    );
  } catch (error) {
    console.error('Error in createCompanyData:', error);
    return sendResponse(
      req,
      res,
      error.statusCode || 500,
      error.clientMessage || 'Failed to create company',
      { error: error.message }
    );
  }
};

// PUT /api/company/:id
const updateCompanyDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Get existing company to check for image changes
    const existingCompany = await getCompanyByIdDB(id);
    if (!existingCompany) {
      return sendResponse(req, res, 404, 'Company not found');
    }

    // Handle file upload/update
    let imageData = existingCompany.image || null;
    if (req.file) {
      // If there was a previous image, delete it from Cloudinary
      if (imageData?.publicId) {
        await deleteCloudinaryImage(imageData.publicId);
      }

      // Set the new image data
      imageData = {
        publicId: req.file.filename,
        url: req.file.path
      };
    } else if (payload.removeImage === 'true') {
      // If explicitly asked to remove image
      if (imageData?.publicId) {
        await deleteCloudinaryImage(imageData.publicId);
      }
      imageData = null;
    }

    // Validate required fields
    if (!payload.email || !payload.phoneNumber || !payload.address) {
      return sendResponse(req, res, 400, 'Email, phone number, and address are required');
    }

    const updatedCompanyData = {
      name: payload.name,
      address: payload.address,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      description: payload.description,
      image: imageData,
      isVisible: payload.isVisible === 'true' || payload.isVisible === true
    };

    const response = await updateCompanyByIdDB(id, updatedCompanyData);
    return sendResponse(
      req,
      res,
      response.statusCode || 200,
      response.clientMessage || 'Company updated successfully',
      response.data
    );
  } catch (error) {
    console.error('Error in updateCompanyDataById:', error);
    return sendResponse(
      req,
      res,
      error.statusCode || 500,
      error.clientMessage || 'Failed to update company',
      { error: error.message }
    );
  }
};

// DELETE /api/company/:id
const deleteCompanyDataById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get company to delete its image
    const company = await getCompanyByIdDB(id);
    if (!company) {
      return sendResponse(req, res, 404, 'Company not found');
    }

    // Delete image from Cloudinary if exists
    if (company.image?.publicId) {
      await deleteCloudinaryImage(company.image.publicId);
    }

    const response = await deleteCompanyByIdDB(id);
    return sendResponse(
      req,
      res,
      response.statusCode || 200,
      response.clientMessage || 'Company deleted successfully'
    );
  } catch (error) {
    console.error('Error in deleteCompanyDataById:', error);
    return sendResponse(
      req,
      res,
      error.statusCode || 500,
      error.clientMessage || 'Failed to delete company',
      { error: error.message }
    );
  }
};

module.exports = {
  getAllCompanyData,
  getCompanyDataById,
  createCompanyData,
  updateCompanyDataById,
  deleteCompanyDataById
};