import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import { FaBox, FaShoppingCart, FaDollarSign, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import '../admin/Admin.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/orders/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card primary">
                <div className="stat-info">
                  <h3>Total Pesanan</h3>
                  <p>{stats?.totalOrders || 0}</p>
                </div>
                <FaBox className="stat-icon" />
              </div>

              <div className="stat-card warning">
                <div className="stat-info">
                  <h3>Pesanan Pending</h3>
                  <p>{stats?.pendingOrders || 0}</p>
                </div>
                <FaClock className="stat-icon" />
              </div>

              <div className="stat-card success">
                <div className="stat-info">
                  <h3>Pesanan Selesai</h3>
                  <p>{stats?.completedOrders || 0}</p>
                </div>
                <FaCheckCircle className="stat-icon" />
              </div>

              <div className="stat-card secondary">
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p style={{ fontSize: '1.5rem' }}>{formatPrice(stats?.totalRevenue || 0)}</p>
                </div>
                <FaDollarSign className="stat-icon" />
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Akses Cepat</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <Link to="/admin/products" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FaBox /> Kelola Produk
                  </Link>
                  <Link to="/admin/categories" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FaShoppingCart /> Kelola Kategori
                  </Link>
                  <Link to="/admin/orders" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <FaBox /> Kelola Pesanan
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
