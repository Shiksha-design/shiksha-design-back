const { Responses } = require('../../utils/responses');
const TopFeatures = require('../../models/topFeatureModel'); // mongoose model

// GET ALL
const getAllTopFeaturesDB = async (userId) => {
  try {
    const data = await TopFeatures.find({isDeleted : false}).lean();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getTopFeaturesByIdDB = async (userId, id) => {
  try {
    const data = await TopFeatures.findOne({ _id: id }).lean();

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
const createTopFeaturesDB = async (payload) => {
  try {
    const data = await TopFeatures.create({
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
const updateTopFeaturesByIdDB = async (id, payload) => {
  try {
    const result = await TopFeatures.updateOne(
      { _id: id },
      { $set: payload }
    );

    if (result.matchedCount === 0) {
      return Responses.badRequest;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// DELETE BY ID
const deleteTopFeaturesByIdDB = async (id) => {
  try {
    const result = await TopFeatures.findOne({ _id: id });

    if (!result) {
      return Responses.notFound;
    }

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

module.exports = {
  getAllTopFeaturesDB,
  getTopFeaturesByIdDB,
  createTopFeaturesDB,
  updateTopFeaturesByIdDB,
  deleteTopFeaturesByIdDB,
};
