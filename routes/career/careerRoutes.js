const express = require('express');
const router = express.Router();
const careerController = require("../../controllers/career/careerController");
const { uploadCareerImages } = require('../../middlewares/uploadMiddleware');

router.post('/addJobPosting', uploadCareerImages, careerController.addJobPosting);
router.put("/updateJobPosting/:id", uploadCareerImages, careerController.updateJobPosting);
router.delete("/deleteJobPosting/:id", careerController.deleteJobPosting);
router.get("/getJobPosting/:id", careerController.getJobPostingById);
router.get("/getAllJobPostings", careerController.getAllJobPostings);
router.get("/searchJobPostings", careerController.searchJobPostings);

module.exports = router;