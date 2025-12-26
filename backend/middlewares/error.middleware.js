// Middleware buat handle semua error
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Error validasi dari Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validasi gagal',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Error data duplikat
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Data sudah ada',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Error foreign key
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Data yang direferensikan tidak ditemukan'
    });
  }

  // Error database
  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan database'
    });
  }

  // Error JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token telah expired'
    });
  }

  // Error upload file
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'Error saat upload file',
      error: err.message
    });
  }

  // Error default kalo yang lain ga cocok
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan server';

  res.status(statusCode).json({
    success: false,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

/**
 * 404 Not Found Handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};
