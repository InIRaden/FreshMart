const db = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Ambil semua produk, bisa pake filter
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      category_id, 
      search, 
      is_available,
      min_price,
      max_price,
      sort = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 10
    } = req.query;

    const whereClause = {};

    if (category_id) {
      whereClause.category_id = category_id;
    }

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    if (is_available !== undefined) {
      whereClause.is_available = is_available === 'true';
    }

    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Op.gte] = min_price;
      if (max_price) whereClause.price[Op.lte] = max_price;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await db.Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      success: true,
      count: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Ambil satu produk by ID
exports.getProduct = async (req, res, next) => {
  try {
    const product = await db.Product.findByPk(req.params.id, {
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Bikin produk baru (admin only)
exports.createProduct = async (req, res, next) => {
  try {
    const { 
      category_id, 
      name, 
      description, 
      price, 
      stock, 
      unit, 
      is_available,
      discount_percentage 
    } = req.body;

    const productData = {
      category_id,
      name,
      description,
      price,
      stock,
      unit,
      is_available,
      discount_percentage
    };

    // Kalo ada upload gambar
    if (req.file) {
      productData.image_url = `/uploads/products/${req.file.filename}`;
    }

    const product = await db.Product.create(productData);

    const fullProduct = await db.Product.findByPk(product.id, {
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Produk berhasil dibuat',
      data: fullProduct
    });
  } catch (error) {
    // Hapus file kalo error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// Update produk
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await db.Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    const updateData = { ...req.body };

    // Kalo ada upload gambar baru
    if (req.file) {
      // Hapus gambar lama dulu
      if (product.image_url) {
        const oldImagePath = path.join(__dirname, '..', product.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image_url = `/uploads/products/${req.file.filename}`;
    }

    await product.update(updateData);

    const updatedProduct = await db.Product.findByPk(product.id, {
      include: [{
        model: db.Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });

    res.status(200).json({
      success: true,
      message: 'Produk berhasil diupdate',
      data: updatedProduct
    });
  } catch (error) {
    // Hapus file kalo error
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/products', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// Hapus produk
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await db.Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    // Hapus gambar juga
    if (product.image_url) {
      const imagePath = path.join(__dirname, '..', product.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: 'Produk berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};

// Update stok produk
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    const product = await db.Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produk tidak ditemukan'
      });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stok berhasil diupdate',
      data: product
    });
  } catch (error) {
    next(error);
  }
};
