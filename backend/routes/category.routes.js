const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/category.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const handleValidationErrors = require('../middlewares/validator.middleware');

// Validation rules
const categoryValidation = [
  body('name').trim().notEmpty().withMessage('Nama kategori wajib diisi').isLength({ min: 2, max: 100 })
];

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategory);

// Private routes (Admin only)
router.post(
  '/', 
  verifyToken, 
  authorizeRoles('admin'), 
  categoryValidation, 
  handleValidationErrors, 
  categoryController.createCategory
);

router.put(
  '/:id', 
  verifyToken, 
  authorizeRoles('admin'), 
  categoryController.updateCategory
);

router.delete(
  '/:id', 
  verifyToken, 
  authorizeRoles('admin'), 
  categoryController.deleteCategory
);

module.exports = router;
