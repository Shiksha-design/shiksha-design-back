const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/companyController');
const { handleCompanyImageUpload } = require('../../middlewares/uploadCompanyImage');

router.get('/', companyController.getAllCompanyData);
router.get('/:id', companyController.getCompanyDataById);
router.post('/create', handleCompanyImageUpload, companyController.createCompanyData);
router.put('/:id', handleCompanyImageUpload, companyController.updateCompanyDataById);
router.delete('/:id', companyController.deleteCompanyDataById);

module.exports = router;