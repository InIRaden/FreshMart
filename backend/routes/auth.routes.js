const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const handleValidationErrors = require('../middlewares/validator.middleware');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Nama wajib diisi').isLength({ min: 3, max: 100 }),
  body('email').trim().notEmpty().withMessage('Email wajib diisi').isEmail().withMessage('Format email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('role').optional().isIn(['admin', 'customer']).withMessage('Role harus admin atau customer')
];

const loginValidation = [
  body('email').trim().notEmpty().withMessage('Email wajib diisi').isEmail().withMessage('Format email tidak valid'),
  body('password').notEmpty().withMessage('Password wajib diisi')
];

// Public routes
router.post('/register', registerValidation, handleValidationErrors, authController.register);
router.post('/login', loginValidation, handleValidationErrors, authController.login);

// Private routes
router.get('/me', verifyToken, authController.getMe);
router.put('/update-profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;
