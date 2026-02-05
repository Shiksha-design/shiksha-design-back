const { Responses } = require('../../utils/responses');
const Program = require('../../models/programModel');

// Format program data with proper image URLs
const formatProgramData = (program) => {
  if (!program) return null;
  
  const formatted = { ...program };
  
  // Ensure images is always an array with proper URL formatting
  if (!formatted.images || !Array.isArray(formatted.images)) {
    formatted.images = [];
  }
  
  // Ensure each image has both url and publicId
  formatted.images = formatted.images.map(img => ({
    url: img?.url || '',
    publicId: img?.publicId || ''
  }));
  
  return formatted;
};

// GET ALL
const getAllProgramDB = async () => {
  try {
    const data = await Program.find({ isDeleted: false })
      .select('-__v -createdAt -updatedAt')
      .populate('categoryId', 'name')
      .lean();
      
    return data.map(program => formatProgramData(program));
  } catch (error) {
    console.error('Error in getAllProgramDB:', error);
    return [];
  }
};

// GET BY ID
const getProgramByIdDB = async (id) => {
  try {
    const data = await Program.findOne({ _id: id, isDeleted: false })
      .select('-__v -createdAt -updatedAt')
      .populate('categoryId', 'name')
      .lean();

    if (!data) {
      return null;
    }

    return formatProgramData(data);
  } catch (error) {
    console.error('Error in getProgramByIdDB:', error);
    return null;
  }
};

// CREATE
const createProgramDB = async (payload) => {
  try {
    // Ensure images is an array
    const programData = {
      ...payload,
      images: Array.isArray(payload.images) ? payload.images : []
    };
    
    const data = await Program.create(programData);

    if (!data) {
      return {
        ...Responses.badRequest,
        message: 'Failed to create program'
      };
    }

    return {
      ...Responses.success,
      data: formatProgramData(data.toObject())
    };
  } catch (error) {
    console.error('Error in createProgramDB:', error);
    return {
      ...Responses.tryAgain,
      error: error.message
    };
  }
};

// UPDATE BY ID
const updateProgramByIdDB = async (id, updateData) => {
  try {
    // Handle image updates if present
    if (updateData.images && !Array.isArray(updateData.images)) {
      delete updateData.images; // Prevent invalid image data
    }
    
    const program = await Program.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .select('-__v -createdAt -updatedAt')
    .populate('categoryId', 'name')
    .lean();

    if (!program) {
      return {
        success: false,
        statusCode: 404,
        clientMessage: 'Program not found',
        message: 'Program not found or already deleted'
      };
    }

    return {
      success: true,
      statusCode: 200,
      clientMessage: 'Program updated successfully',
      data: formatProgramData(program)
    };
  } catch (error) {
    console.error('Error in updateProgramByIdDB:', error);
    return {
      success: false,
      statusCode: 500,
      clientMessage: 'Failed to update program',
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
};

// DELETE BY ID (Soft delete)
const deleteProgramByIdDB = async (id) => {
  try {
    const result = await Program.findByIdAndUpdate(
      id,
      { 
        $set: { 
          isDeleted: true, 
          deletedAt: new Date(),
          // Optionally clear sensitive data or mark images for cleanup
          // 'images.$[].url': null,
          // 'images.$[].publicId': null
        } 
      },
      { new: true }
    );

    if (!result) {
      return {
        ...Responses.notFound,
        message: 'Program not found or already deleted'
      };
    }

    return {
      ...Responses.success,
      message: 'Program deleted successfully',
      data: { _id: result._id }
    };
  } catch (error) {
    console.error('Error in deleteProgramByIdDB:', error);
    return {
      ...Responses.tryAgain,
      error: error.message
    };
  }
};

module.exports = {
  getAllProgramDB,
  getProgramByIdDB,
  createProgramDB,
  updateProgramByIdDB,
  deleteProgramByIdDB,
};
