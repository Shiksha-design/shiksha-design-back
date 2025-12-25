const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/companyController');

router.get('/', companyController.getAllCompanyData);
router.get('/:id', companyController.getCompanyDataById);
router.post('/create', companyController.createCompanyData);
router.put('/:id', companyController.updateCompanyDataById);
router.delete('/:id', companyController.deleteCompanyDataById);

module.exports = router;