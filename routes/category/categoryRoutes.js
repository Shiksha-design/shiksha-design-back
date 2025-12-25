const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category/categoryController');

router.get('/', categoryController.getAllCategoryData);
router.get('/:id', categoryController.getCategoryDataById);
router.post('/create', categoryController.createCategoryData);
router.put('/:id', categoryController.updateCategoryDataById);
router.delete('/:id', categoryController.deleteCategoryDataById);

module.exports = router;