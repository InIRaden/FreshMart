const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

/**
 * Send Token Response
 */
const sendTokenResponse = (user, statusCode, res, message = 'Berhasil login') => {
  const token = generateToken(user.id);

  res.status(statusCode).json({
    success: true,
    message: message,
    data: {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    }
  });
};

module.exports = {
  generateToken,
  sendTokenResponse
};
