const { Responses } = require('../../utils/responses');
const Company = require('../../models/companyModel');
const { saveFile, editFile } = require('../../utils/helper'); // same helper

// GET ALL
const getAllCompanyDB = async () => {
  try {
    return await Company.find({ isDeleted: false }).lean();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getCompanyByIdDB = async (id) => {
  try {
    return await Company.findOne({ _id: id, isDeleted: false }).lean();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// CREATE
const createCompanyDB = async (payload) => {
  try {
    const company = await Company.create({
      name: payload.name,
      description: payload.description,
      logoDetails : {}
    });

    if (!company) return Responses.badRequest;

    // save file if exists
    if (payload.fileDetails) {
      const fileResponse = await saveFile(
        payload?.fileDetails,
        'company',
        company._id.toString()
      );

      if (!fileResponse.success) return Responses.tryAgain;

      company.logoDetails = fileResponse.fileDetails;
      await company.save();
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE
const updateCompanyByIdDB = async (id, payload) => {
  try {
    const company = await getCompanyByIdDB(id);
    if (!company) return Responses.notFound;

    const updateData = {
      name: payload.name,
      description: payload.description
    };

    // if new file uploaded
    if (payload.fileDetails) {
      const fileResponse = await editFile(
        payload.fileDetails,
        'company',
        id,
        company.logoDetails?.filePath
      );

      if (!fileResponse.success) return Responses.tryAgain;

      updateData.logoDetails = fileResponse.fileDetails;
    }

    await Company.updateOne({ _id: id }, { $set: updateData });

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE (soft delete + file cleanup)
const deleteCompanyByIdDB = async (id) => {
  try {
    const company = await Company.findById(id);
    if (!company) return Responses.notFound;

    await Company.updateOne(
      { _id: id },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

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
  deleteCompanyByIdDB
};
