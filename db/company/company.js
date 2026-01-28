// db/company/company.js
const { Responses } = require('../../utils/responses');
const Company = require('../../models/companyModel');
const { cloudinary } = require('../../config/cloudinary');

// GET ALL
const getAllCompanyDB = async () => {
  try {
    return await Company.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error('Error in getAllCompanyDB:', error);
    return [];
  }
};

// GET BY ID
const getCompanyByIdDB = async (id) => {
  try {
    return await Company.findOne({ _id: id, isDeleted: false }).lean();
  } catch (error) {
    console.error('Error in getCompanyByIdDB:', error);
    return null;
  }
};

// CREATE
const createCompanyDB = async (payload) => {
  try {
    const company = await Company.create(payload);
    return {
      ...Responses.success,
      data: company
    };
  } catch (error) {
    console.error('Error in createCompanyDB:', error);
    return {
      ...Responses.tryAgain,
      error: error.message
    };
  }
};

// UPDATE
const updateCompanyByIdDB = async (id, payload) => {
  try {
    const company = await Company.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    ).lean();

    if (!company) {
      return Responses.notFound;
    }

    return {
      ...Responses.success,
      data: company
    };
  } catch (error) {
    console.error('Error in updateCompanyByIdDB:', error);
    return {
      ...Responses.tryAgain,
      error: error.message
    };
  }
};

// DELETE (soft delete)
const deleteCompanyByIdDB = async (id) => {
  try {
    const company = await Company.findByIdAndUpdate(
      id,
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date()
        }
      },
      { new: true }
    ).lean();

    if (!company) {
      return Responses.notFound;
    }

    // Delete image from Cloudinary if exists
    if (company.image?.publicId) {
      try {
        await cloudinary.uploader.destroy(company.image.publicId);
      } catch (err) {
        console.error('Error deleting image from Cloudinary:', err);
        // Continue with deletion even if image deletion fails
      }
    }

    return Responses.success;
  } catch (error) {
    console.error('Error in deleteCompanyByIdDB:', error);
    return {
      ...Responses.tryAgain,
      error: error.message
    };
  }
};

module.exports = {
  getAllCompanyDB,
  getCompanyByIdDB,
  createCompanyDB,
  updateCompanyByIdDB,
  deleteCompanyByIdDB
};