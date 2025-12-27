const fs = require('fs');
const path = require('path');

const saveFile = async (file, attachmentType, documentId) => {
    try {
        if (!file || !attachmentType || !documentId) {
            return {
                success: false,
                error: 'Missing required parameters'
            };
        }

        const folderName = attachmentType === 'topFeature' ? 'topFeatures' : attachmentType;
        const uploadDir = path.join(__dirname, '..', 'uploads', folderName);

        // Create folder if not exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Sanitize filename (replace spaces with underscore)
        const cleanFileName = file.originalname.replace(/\s+/g, '_');
        // Final file name
        const finalFileName = `${documentId}_${cleanFileName}`;
        const filePath = path.join(uploadDir, finalFileName);

        // Write to the new location
        fs.writeFileSync(filePath, file.buffer);

        // Get file stats for size
        const stats = fs.statSync(filePath);

        return {
            success: true,
            fileDetails: {
                filePath: path.join('uploads', folderName, finalFileName).replace(/\\/g, '/'),
                fileName: finalFileName,
                originalName: file.originalname,
                size: stats.size, // Size in bytes
                mimeType: file.mimetype
            }
        };
    } catch (error) {
        console.error('saveFile error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

const editFile = async (file, attachmentType, documentId, oldFilePath) => {
    try {
        if (!file || !attachmentType || !documentId) {
            return { success: false, error: 'Missing parameters' };
        }

        // Delete old file if exists
        if (oldFilePath) {
            const absoluteOldPath = path.join(process.cwd(), oldFilePath);
            if (fs.existsSync(absoluteOldPath)) {
                fs.unlinkSync(absoluteOldPath);
            }
        }

        // Save new file
        return await saveFile(file, attachmentType, documentId);
    } catch (error) {
        console.error('editFile error:', error);
        return { success: false, error: error.message };
    }
};

const deleteFile = (filePath) => {
    try {
        if (!filePath) return false;

        const absolutePath = path.join(process.cwd(), filePath);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            return true;
        }

        return false;
    } catch (error) {
        console.error('deleteFile error:', error);
        return false;
    }
};

module.exports = {
    saveFile,
    editFile,
    deleteFile
};
