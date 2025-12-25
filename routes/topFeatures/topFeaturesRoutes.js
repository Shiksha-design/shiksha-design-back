const express = require('express');
const router = express.Router();
const topFeaturesController = require('../../controllers/topFeatures/topFeaturesController');

router.get('/', topFeaturesController.getAllTopFeaturesData);
router.post('/create', topFeaturesController.createTopFeaturesData);
router.put('/:id', topFeaturesController.updateTopFeaturesDataById);
router.delete('/:id', topFeaturesController.deleteTopFeaturesDataById);

module.exports = router;