const { Responses } = require('../../utils/responses');
const Program = require('../../models/programModel'); // mongoose model

// GET ALL
const getAllProgramDB = async () => {
  try {
    const data = await Program.find({isDeleted : false}).lean();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// GET BY ID
const getProgramByIdDB = async (id) => {
  try {
    const data = await Program.findOne({ _id: id }).lean();

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
const createProgramDB = async (payload) => {
  try {
    const data = await Program.create({
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
const updateProgramByIdDB = async (id, payload) => {
  try {
    const result = await Program.updateOne(
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
const deleteProgramByIdDB = async (id) => {
  try {
    const result = await Program.updateOne({ _id: id }, { $set: { isDeleted: true, deletedAt: new Date() } });

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
  getAllProgramDB,
  getProgramByIdDB,
  createProgramDB,
  updateProgramByIdDB,
  deleteProgramByIdDB,
};
