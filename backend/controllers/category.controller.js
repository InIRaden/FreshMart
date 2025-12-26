const db = require('../models');

// Ambil semua kategori
exports.getCategories = async (req, res, next) => {
  try {
    const { is_active } = req.query;

    const whereClause = {};
    if (is_active !== undefined) {
      whereClause.is_active = is_active === 'true';
    }

    const categories = await db.Category.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Ambil detail satu kategori
exports.getCategory = async (req, res, next) => {
  try {
    const category = await db.Category.findByPk(req.params.id, {
      include: [{
        model: db.Product,
        as: 'products',
        where: { is_available: true },
        required: false
      }]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Bikin kategori baru
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, is_active } = req.body;

    const category = await db.Category.create({
      name,
      description,
      is_active
    });

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Update kategori yang udah ada
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, is_active } = req.body;

    const category = await db.Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }

    await category.update({
      name: name || category.name,
      description: description !== undefined ? description : category.description,
      is_active: is_active !== undefined ? is_active : category.is_active
    });

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil diupdate',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// Hapus kategori
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await db.Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Kategori tidak ditemukan'
      });
    }

    // Check if category has products
    const productCount = await db.Product.count({
      where: { category_id: req.params.id }
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Kategori tidak dapat dihapus karena masih memiliki produk'
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Kategori berhasil dihapus'
    });
  } catch (error) {
    next(error);
  }
};
