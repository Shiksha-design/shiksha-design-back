const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/company/companyController');
const { uploadSingle } = require('../../middlewares/multerConfig');

router.get('/', companyController.getAllCompanyData);
router.get('/:id', companyController.getCompanyDataById);
router.post('/create', uploadSingle('companyImage'), companyController.createCompanyData);
router.put('/:id', uploadSingle('companyImage'), companyController.updateCompanyDataById);
router.delete('/:id', companyController.deleteCompanyDataById);

module.exports = router;