const express = require('express');
const router = express.Router();
const registeredCompanyController = require("../../controllers/company/registeredCompanyController");

router.post('/createRegisteredCompany', registeredCompanyController.registerCompany);
router.get('/getRegisteredCompany', registeredCompanyController.getRegisteredCompany);
router.put('/updateRegisteredCompany', registeredCompanyController.updateRegisteredCompany);

module.exports = router;    