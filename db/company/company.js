const { Responses } = require('../../utils/responses');
const Company = require('../../models/companyModel'); // mongoose model

// GET ALL
const getAllCompanyDB = async () => {
  try {
    const data = await Company.find({isDeleted : false}).lean();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getCompanyByIdDB = async (id) => {
  try {
    const data = await Company.findOne({ _id: id }).lean();

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// CREATE
const createCompanyDB = async (payload) => {
  try {
    const data = await Company.create({
      ...payload
    });

    if (!data) {
      return Responses.badRequest;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE BY ID
const updateCompanyByIdDB = async (id, payload) => {
  try {
    const result = await Company.updateOne(
      { _id: id },
      { $set: payload }
    );

    if (result.modifiedCount === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE BY ID
const deleteCompanyByIdDB = async (id) => {
  try {
    const result = await Company.updateOne({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date() } });

    if (result.modifiedCount === 0) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

module.exports = {
  getAllCompanyDB,
  getCompanyByIdDB,
  createCompanyDB,
  updateCompanyByIdDB,
  deleteCompanyByIdDB,
};
