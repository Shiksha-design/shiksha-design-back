const express = require('express');
const router = express.Router();
const topFeaturesController = require('../../controllers/topFeatures/topFeaturesController');
const { uploadSingle } = require('../../middlewares/multerConfig');

router.get('/', topFeaturesController.getAllTopFeaturesData);
router.post('/create', uploadSingle('featureImage'), topFeaturesController.createTopFeaturesData);
router.put('/:id', uploadSingle('featureImage'), topFeaturesController.updateTopFeaturesDataById);
router.delete('/:id', topFeaturesController.deleteTopFeaturesDataById);

module.exports = router;