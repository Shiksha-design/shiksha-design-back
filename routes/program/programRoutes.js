const express = require('express');
const router = express.Router();
const programController = require('../../controllers/program/programController');

router.get('/', programController.getAllProgramData);
router.get('/:id', programController.getProgramDataById);
router.post('/create', programController.createProgramData);
router.put('/:id', programController.updateProgramDataById);
router.delete('/:id', programController.deleteProgramDataById);

module.exports = router;