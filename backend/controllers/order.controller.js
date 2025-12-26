const db = require('../models');
const { Op } = require('sequelize');

// Ambil semua order (Admin: semua, User: punya sendiri)
exports.getOrders = async (req, res, next) => {
  try {
    const { status, payment_status, page = 1, limit = 10 } = req.query;

    const whereClause = {};

    // Kalo bukan admin, cuma bisa liat order sendiri
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.id;
    }

    if (status) {
      whereClause.status = status;
    }

    if (payment_status) {
      whereClause.payment_status = payment_status;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await db.Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: db.OrderItem,
          as: 'orderItems',
          include: [{
            model: db.Product,
            as: 'product',
            attributes: ['id', 'name', 'image_url']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      success: true,
      count: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / parseInt(limit)),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Ambil detail satu order
exports.getOrder = async (req, res, next) => {
  try {
    const whereClause = { id: req.params.id };

    // Kalo bukan admin, cuma bisa liat order sendiri
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.id;
    }

    const order = await db.Order.findOne({
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone', 'address']
        },
        {
          model: db.OrderItem,
          as: 'orderItems',
          include: [{
            model: db.Product,
            as: 'product',
            attributes: ['id', 'name', 'image_url', 'unit']
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Bikin order baru
exports.createOrder = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { items, payment_method, shipping_address, notes } = req.body;

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Items tidak boleh kosong'
      });
    }

    // Validasi produk dan hitung total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.Product.findByPk(item.product_id);

      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Produk dengan ID ${item.product_id} tidak ditemukan`
        });
      }

      if (!product.is_available) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Produk ${product.name} tidak tersedia`
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Stok produk ${product.name} tidak mencukupi`
        });
      }

      const price = product.getFinalPrice();
      const subtotal = price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: price,
        subtotal: subtotal
      });

      // Update stok produk
      product.stock -= item.quantity;
      await product.save({ transaction });
    }

    // Create order
    const order = await db.Order.create({
      user_id: req.user.id,
      total_amount: totalAmount,
      payment_method,
      shipping_address,
      notes
    }, { transaction });

    // Bikin order items
    for (const item of orderItems) {
      await db.OrderItem.create({
        order_id: order.id,
        ...item
      }, { transaction });
    }

    await transaction.commit();

    // Ambil data order lengkap
    const fullOrder = await db.Order.findByPk(order.id, {
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phone']
        },
        {
          model: db.OrderItem,
          as: 'orderItems',
          include: [{
            model: db.Product,
            as: 'product',
            attributes: ['id', 'name', 'image_url', 'unit']
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      data: fullOrder
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Update status order
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await db.Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Status order berhasil diupdate',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update status pembayaran
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { payment_status } = req.body;

    const order = await db.Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    order.payment_status = payment_status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Status pembayaran berhasil diupdate',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const whereClause = { id: req.params.id };

    // Kalo bukan admin, cuma bisa cancel order sendiri
    if (req.user.role !== 'admin') {
      whereClause.user_id = req.user.id;
    }

    const order = await db.Order.findOne({
      where: whereClause,
      include: [{
        model: db.OrderItem,
        as: 'orderItems'
      }]
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Order tidak dapat dibatalkan'
      });
    }

    // Kembaliin stok produk
    for (const item of order.orderItems) {
      const product = await db.Product.findByPk(item.product_id);
      product.stock += item.quantity;
      await product.save({ transaction });
    }

    order.status = 'cancelled';
    await order.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Order berhasil dibatalkan',
      data: order
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Ambil statistik order (Admin only)
exports.getOrderStats = async (req, res, next) => {
  try {
    const totalOrders = await db.Order.count();
    const pendingOrders = await db.Order.count({ where: { status: 'pending' } });
    const processingOrders = await db.Order.count({ where: { status: 'processing' } });
    const deliveredOrders = await db.Order.count({ where: { status: 'delivered' } });
    const cancelledOrders = await db.Order.count({ where: { status: 'cancelled' } });

    const totalRevenue = await db.Order.sum('total_amount', {
      where: { 
        payment_status: 'paid',
        status: { [Op.ne]: 'cancelled' }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (error) {
    next(error);
  }
};
