const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const handleValidationErrors = require('../middlewares/validator.middleware');
const upload = require('../middlewares/upload.middleware');

// Validation rules
const productValidation = [
  body('category_id').notEmpty().withMessage('Kategori wajib diisi').isInt(),
  body('name').trim().notEmpty().withMessage('Nama produk wajib diisi').isLength({ min: 3, max: 200 }),
  body('price').notEmpty().withMessage('Harga wajib diisi').isFloat({ min: 0 }),
  body('stock').notEmpty().withMessage('Stok wajib diisi').isInt({ min: 0 }),
  body('unit').notEmpty().withMessage('Unit wajib diisi').isIn(['kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'box'])
];

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Private routes (Admin only)
router.post(
  '/', 
  verifyToken, 
  authorizeRoles('admin'),
  upload.single('image'),
  productValidation,
  handleValidationErrors,
  productController.createProduct
);

router.put(
  '/:id', 
  verifyToken, 
  authorizeRoles('admin'),
  upload.single('image'),
  productController.updateProduct
);

router.delete(
  '/:id', 
  verifyToken, 
  authorizeRoles('admin'),
  productController.deleteProduct
);

router.patch(
  '/:id/stock', 
  verifyToken, 
  authorizeRoles('admin'),
  productController.updateStock
);

module.exports = router;
