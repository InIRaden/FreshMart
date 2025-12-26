'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin Fresh Mart',
        email: 'admin@freshmart.com',
        password: hashedPassword,
        role: 'admin',
        phone: '081234567890',
        address: 'Jl. Admin No. 1, Jakarta',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Customer Test',
        email: 'customer@test.com',
        password: await bcrypt.hash('customer123', 10),
        role: 'customer',
        phone: '081234567891',
        address: 'Jl. Customer No. 2, Jakarta',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
