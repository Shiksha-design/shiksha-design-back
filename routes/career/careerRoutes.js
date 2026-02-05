const express = require('express');
const router = express.Router();
const careerController = require("../../controllers/career/careerController");
const { handleFileUpload, handleUploadErrors } = require('../../middlewares/uploadProgramImages');

router.post('/addJobPosting', handleFileUpload, careerController.addJobPosting);
router.put("/updateJobPosting/:id", handleFileUpload, careerController.updateJobPosting);
router.delete("/deleteJobPosting/:id", careerController.deleteJobPosting);
router.get("/getJobPosting/:id", careerController.getJobPostingById);
router.get("/getAllJobPostings", careerController.getAllJobPostings);
router.get("/searchJobPostings", careerController.searchJobPostings);

module.exports = router;