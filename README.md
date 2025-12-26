# Fresh Mart - E-Commerce Fresh Market

## Deskripsi Project
Fresh Mart adalah aplikasi e-commerce berbasis web untuk penjualan produk fresh market (sayuran, buah-buahan, daging, seafood, dll). Aplikasi ini memiliki fitur lengkap untuk customer dan admin dengan sistem autentikasi berbasis role.

## Fitur Utama

### Customer Features
- Registrasi dan Login
- Browse dan Filter Produk
- Shopping Cart Management
- Checkout dan Order
- Riwayat Pesanan
- Profile Management

### Admin Features
- Dashboard dengan statistik
- CRUD Kategori Produk
- CRUD Produk (dengan upload gambar)
- Manajemen Orders
- Update Status Order & Pembayaran

## Tech Stack

### Backend
- Node.js - JavaScript Runtime
- Express.js - Web Framework
- MySQL - Database
- Sequelize - ORM (Object-Relational Mapping)
- JWT - Authentication
- Bcrypt - Password Hashing
- Multer - File Upload

### Frontend
- React.js - UI Library
- Vite - Build Tool
- React Router - Routing
- Axios - HTTP Client
- Context API - State Management
- React Icons - Icon Library
- React Toastify - Notifications

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi MySQL kalian
npm run migrate
npm run seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Demo Credentials
- Admin: admin@freshmart.com / admin123
- Customer: customer@test.com / customer123


## Schema database
```
Users (1:N) Orders (1:N) OrderItems (N:1) Products (N:1) Categories
```

## Main API Endpoints
- `/api/auth/` - Authentication
- `/api/categories/` - Category Management
- `/api/products/` - Product Management
- `/api/orders/` - Order Management

