import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    payment_method: 'cash',
    shipping_address: user?.address || '',
    notes: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const getFinalPrice = (product) => {
    if (product.discount_percentage > 0) {
      return product.price * (1 - product.discount_percentage / 100);
    }
    return product.price;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shipping_address.trim()) {
      toast.error('Alamat pengiriman harus diisi');
      return;
    }

    if (cart.length === 0) {
      toast.error('Keranjang belanja kosong');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        payment_method: formData.payment_method,
        shipping_address: formData.shipping_address,
        notes: formData.notes
      };

      const response = await api.post('/orders', orderData);
      
      toast.success('Pesanan berhasil dibuat!');
      clearCart();
      navigate('/my-orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <h2>Keranjang Belanja Kosong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Silakan tambahkan produk ke keranjang terlebih dahulu
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Kembali Belanja
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
        <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>

        <div className="grid grid-cols-2" style={{ gap: '2rem', alignItems: 'start' }}>
          {/* Form Section */}
          <div className="card">
            <div className="card-header">
              <h3>Informasi Pengiriman</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.name || ''}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user?.phone || ''}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Pengiriman *</label>
                  <textarea
                    name="shipping_address"
                    className="form-control"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan alamat lengkap..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Metode Pembayaran *</label>
                  <select
                    name="payment_method"
                    className="form-control"
                    value={formData.payment_method}
                    onChange={handleChange}
                    required
                  >
                    <option value="cash">Cash (COD)</option>
                    <option value="transfer">Transfer Bank</option>
                    <option value="e-wallet">E-Wallet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Catatan (Opsional)</label>
                  <textarea
                    name="notes"
                    className="form-control"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Catatan untuk pesanan..."
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Buat Pesanan'}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <h3>Ringkasan Pesanan</h3>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '1rem' }}>
                {cart.map((item) => {
                  const finalPrice = getFinalPrice(item);
                  const subtotal = finalPrice * item.quantity;

                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500' }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {formatPrice(finalPrice)} x {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontWeight: 'bold' }}>
                        {formatPrice(subtotal)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1rem' }}>
                <div className="flex-between" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  <span>Total Pembayaran:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
