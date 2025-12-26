'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Sayuran',
        description: 'Berbagai macam sayuran segar',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Buah-buahan',
        description: 'Buah segar pilihan',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Daging',
        description: 'Daging segar berkualitas',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Seafood',
        description: 'Ikan dan hasil laut segar',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Susu & Telur',
        description: 'Produk susu dan telur',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
