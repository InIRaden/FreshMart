'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      // Sayuran
      {
        category_id: 1,
        name: 'Bayam Segar',
        description: 'Bayam hijau segar untuk sayur',
        price: 5000,
        stock: 50,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 1,
        name: 'Kangkung',
        description: 'Kangkung hijau segar',
        price: 4000,
        stock: 60,
        unit: 'kg',
        is_available: true,
        discount_percentage: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 1,
        name: 'Wortel',
        description: 'Wortel segar untuk masakan',
        price: 8000,
        stock: 40,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Buah-buahan
      {
        category_id: 2,
        name: 'Apel Fuji',
        description: 'Apel Fuji import segar',
        price: 35000,
        stock: 30,
        unit: 'kg',
        is_available: true,
        discount_percentage: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 2,
        name: 'Jeruk Mandarin',
        description: 'Jeruk mandarin manis',
        price: 25000,
        stock: 45,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 2,
        name: 'Pisang Cavendish',
        description: 'Pisang cavendish premium',
        price: 18000,
        stock: 50,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Daging
      {
        category_id: 3,
        name: 'Daging Sapi',
        description: 'Daging sapi segar pilihan',
        price: 120000,
        stock: 25,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 3,
        name: 'Ayam Kampung',
        description: 'Ayam kampung segar',
        price: 45000,
        stock: 35,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Seafood
      {
        category_id: 4,
        name: 'Ikan Salmon',
        description: 'Ikan salmon segar import',
        price: 150000,
        stock: 20,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 4,
        name: 'Udang Windu',
        description: 'Udang windu segar',
        price: 85000,
        stock: 30,
        unit: 'kg',
        is_available: true,
        discount_percentage: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Susu & Telur
      {
        category_id: 5,
        name: 'Telur Ayam',
        description: 'Telur ayam kampung',
        price: 28000,
        stock: 100,
        unit: 'kg',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: 5,
        name: 'Susu Segar',
        description: 'Susu sapi segar 1 liter',
        price: 15000,
        stock: 50,
        unit: 'liter',
        is_available: true,
        discount_percentage: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};
