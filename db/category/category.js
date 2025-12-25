const { Responses } = require('../../utils/responses');
const Category = require('../../models/categoryModel'); // mongoose model

// GET ALL
const getAllCategoryDB = async () => {
  try {
    const data = await Category.find({isDeleted : false}).lean();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getCategoryByIdDB = async (id) => {
  try {
    const data = await Category.findOne({ _id: id, isDeleted : false }).lean();

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
const createCategoryDB = async (payload) => {
  try {
    const data = await Category.create({
      ...payload,
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
const updateCategoryByIdDB = async (id, payload) => {
  try {
    const result = await Category.updateOne(
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
const deleteCategoryByIdDB = async (id) => {
  try {
    const result = await Category.updateOne({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date() } });

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
  getAllCategoryDB,
  getCategoryByIdDB,
  createCategoryDB,
  updateCategoryByIdDB,
  deleteCategoryByIdDB,
};
