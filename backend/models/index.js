const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '+07:00',
    define: {
      timestamps: true,
      underscored: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.User = require('./user.model')(sequelize, Sequelize);
db.Category = require('./category.model')(sequelize, Sequelize);
db.Product = require('./product.model')(sequelize, Sequelize);
db.Order = require('./order.model')(sequelize, Sequelize);
db.OrderItem = require('./orderItem.model')(sequelize, Sequelize);

// Define Associations
// Category - Product (One to Many)
db.Category.hasMany(db.Product, {
  foreignKey: 'category_id',
  as: 'products'
});
db.Product.belongsTo(db.Category, {
  foreignKey: 'category_id',
  as: 'category'
});

// User - Order (One to Many)
db.User.hasMany(db.Order, {
  foreignKey: 'user_id',
  as: 'orders'
});
db.Order.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Order - OrderItem (One to Many)
db.Order.hasMany(db.OrderItem, {
  foreignKey: 'order_id',
  as: 'orderItems'
});
db.OrderItem.belongsTo(db.Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// Product - OrderItem (One to Many)
db.Product.hasMany(db.OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems'
});
db.OrderItem.belongsTo(db.Product, {
  foreignKey: 'product_id',
  as: 'product'
});

module.exports = db;
