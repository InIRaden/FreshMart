const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { verifyToken, authorizeRoles } = require('../middlewares/auth.middleware');
const handleValidationErrors = require('../middlewares/validator.middleware');

// Validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Items wajib diisi dan minimal 1 item'),
  body('items.*.product_id').isInt().withMessage('Product ID harus integer'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity minimal 1'),
  body('payment_method').isIn(['cash', 'transfer', 'e-wallet']).withMessage('Payment method tidak valid'),
  body('shipping_address').trim().notEmpty().withMessage('Alamat pengiriman wajib diisi')
];

// Private routes
router.get('/', verifyToken, orderController.getOrders);
router.get('/stats', verifyToken, authorizeRoles('admin'), orderController.getOrderStats);
router.get('/:id', verifyToken, orderController.getOrder);

router.post(
  '/', 
  verifyToken, 
  createOrderValidation, 
  handleValidationErrors, 
  orderController.createOrder
);

router.put(
  '/:id/status', 
  verifyToken, 
  authorizeRoles('admin'), 
  orderController.updateOrderStatus
);

router.put(
  '/:id/payment', 
  verifyToken, 
  authorizeRoles('admin'), 
  orderController.updatePaymentStatus
);

router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

module.exports = router;
