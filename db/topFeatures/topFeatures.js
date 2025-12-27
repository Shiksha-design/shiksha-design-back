const { Responses } = require('../../utils/responses');
const { saveFile, editFile } = require('../../utils/helper');
const TopFeatures = require('../../models/topFeatureModel'); // mongoose model

// GET ALL
const getAllTopFeaturesDB = async (userId) => {
  try {
    const data = await TopFeatures.find({ isDeleted: false }).lean();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getTopFeaturesByIdDB = async (id) => {
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
    const tempPayload = {
      value: payload.value,
      isVisible: payload.isVisible,
      fileDetails: {}
    };

    const data = await TopFeatures.create(tempPayload);

    if (!data) {
      throw new Error('Failed to create top feature');
    }

    const response = await saveFile(payload.fileDetails, 'topFeature', data._id.toString());
    if(response.success){
      data.fileDetails = response.fileDetails;
    }
    await data.save();

    return Responses.success;
  } catch (error) {
    console.error(error);
    return Responses.tryAgain;
  }
};

// UPDATE BY ID
const updateTopFeaturesByIdDB = async (id, payload) => {
  try {
    const updateData = {
      value: payload.value,
      isVisible: payload.isVisible
    };

    const oldTopFeature = await getTopFeaturesByIdDB(id);

    // If new file is uploaded → replace old one
    if (payload.fileDetails) {
      const fileResponse = await editFile(
        payload.fileDetails,
        'topFeature',
        id,
        oldTopFeature.fileDetails?.filePath
      );

      if (!fileResponse.success) {
        return Responses.tryAgain;
      }

      updateData.fileDetails = fileResponse.fileDetails;
    }

    const result = await TopFeatures.updateOne(
      { _id: id },
      { $set: updateData }
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
