import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category_id: '',
    search: '',
    sort: 'createdAt',
    order: 'DESC'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories?is_active=true');
      setCategories(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat kategori');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { ...filters, is_available: true };
      const response = await api.get('/products', { params });
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar />
      <div className="container shop-container">
        <h1 style={{ marginBottom: '2rem' }}>Belanja Produk Segar</h1>

        <div className="shop-filters">
          <input
            type="text"
            name="search"
            className="form-control"
            placeholder="Cari produk..."
            value={filters.search}
            onChange={handleFilterChange}
          />

          <select name="category_id" className="form-control" value={filters.category_id} onChange={handleFilterChange}>
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select name="sort" className="form-control" value={filters.sort} onChange={handleFilterChange} style={{ minWidth: '150px' }}>
            <option value="createdAt">Terbaru</option>
            <option value="name">Nama</option>
            <option value="price">Harga</option>
          </select>

          <select name="order" className="form-control" value={filters.order} onChange={handleFilterChange}>
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center" style={{ padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Tidak ada produk yang ditemukan</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
