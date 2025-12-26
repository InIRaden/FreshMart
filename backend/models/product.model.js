module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nama produk tidak boleh kosong' },
        len: { args: [3, 200], msg: 'Nama produk harus antara 3-200 karakter' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Harga tidak boleh kosong' },
        min: { args: [0], msg: 'Harga minimal 0' }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Stok minimal 0' }
      }
    },
    unit: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'kg',
      validate: {
        isIn: {
          args: [['kg', 'gram', 'liter', 'ml', 'pcs', 'pack', 'box']],
          msg: 'Unit tidak valid'
        }
      }
    },
    image_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: 'Diskon minimal 0%' },
        max: { args: [100], msg: 'Diskon maksimal 100%' }
      }
    }
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true
  });

  // Method buat ngitung harga setelah diskon
  Product.prototype.getFinalPrice = function() {
    const discount = (parseFloat(this.price) * parseFloat(this.discount_percentage)) / 100;
    return parseFloat(this.price) - discount;
  };

  return Product;
};
