const db = require('../models');
const { sendTokenResponse } = require('../utils/jwt.util');

// Register user baru
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role } = req.body;

    // Create user
    const user = await db.User.create({
      name,
      email,
      password,
      phone,
      address,
      role: role || 'customer'
    });

    sendTokenResponse(user, 201, res, 'Registrasi berhasil');
  } catch (error) {
    next(error);
  }
};

// Login - cek email dan password
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Email dan password harus diisi
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi'
      });
    }

    // Cari user berdasarkan email
    const user = await db.User.findOne({ 
      where: { email },
      attributes: { include: ['password'] }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Cocokin password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Pastikan akun masih aktif
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda tidak aktif'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Ambil data user yang login
exports.getMe = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update profile user
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const user = await db.User.findByPk(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile berhasil diupdate',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Ganti password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password lama dan password baru wajib diisi'
      });
    }

    const user = await db.User.findByPk(req.user.id, {
      attributes: { include: ['password'] }
    });

    // Pastikan password lama bener
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password lama tidak sesuai'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password berhasil diubah'
    });
  } catch (error) {
    next(error);
  }
};
