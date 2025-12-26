const jwt = require('jsonwebtoken');
const db = require('../models');

// Middleware buat cek JWT Token
const verifyToken = async (req, res, next) => {
  try {
    // Ambil token dari header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan, akses ditolak'
      });
    }

    // Cek tokennya valid atau nggak
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ambil data user dari database
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda tidak aktif'
      });
    }

    // Masukin user ke request biar bisa dipake di controller
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah expired'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi token',
      error: error.message
    });
  }
};

// Middleware buat ngecek role user
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} tidak memiliki akses ke resource ini`
      });
    }
    next();
  };
};

/**
 * Middleware untuk verifikasi owner resource atau admin
 */
const verifyOwnerOrAdmin = (userIdParam = 'id') => {
  return (req, res, next) => {
    const userId = parseInt(req.params[userIdParam]);
    
    if (req.user.role === 'admin' || req.user.id === userId) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke resource ini'
      });
    }
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
  verifyOwnerOrAdmin
};
