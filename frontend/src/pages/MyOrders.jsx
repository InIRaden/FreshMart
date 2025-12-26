import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const response = await api.get('/orders', { params });
      setOrders(response.data.data);
    } catch (error) {
      toast.error('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', icon: <FaClock />, text: 'Menunggu' },
      processing: { class: 'badge-info', icon: <FaBox />, text: 'Diproses' },
      shipped: { class: 'badge-info', icon: <FaTruck />, text: 'Dikirim' },
      delivered: { class: 'badge-success', icon: <FaCheckCircle />, text: 'Selesai' },
      cancelled: { class: 'badge-danger', icon: <FaTimesCircle />, text: 'Dibatalkan' }
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.class}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const badges = {
      unpaid: { class: 'badge-danger', text: 'Belum Bayar' },
      paid: { class: 'badge-success', text: 'Sudah Bayar' },
      refunded: { class: 'badge-warning', text: 'Refund' }
    };

    const badge = badges[status] || badges.unpaid;
    return <span className={`badge ${badge.class}`}>{badge.text}</span>;
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success('Pesanan berhasil dibatalkan');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membatalkan pesanan');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h1 style={{ marginBottom: '2rem' }}>Pesanan Saya</h1>

        <div style={{ marginBottom: '2rem' }}>
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="processing">Diproses</option>
            <option value="shipped">Dikirim</option>
            <option value="delivered">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="card">
            <div className="card-body text-center" style={{ padding: '3rem' }}>
              <FaBox style={{ fontSize: '3rem', color: 'var(--text-secondary)', marginBottom: '1rem' }} />
              <h3>Belum Ada Pesanan</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Anda belum memiliki pesanan</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => (
              <div key={order.id} className="card">
                <div className="card-header">
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        {order.order_number}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {getStatusBadge(order.status)}
                      {getPaymentBadge(order.payment_status)}
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div style={{ marginBottom: '1rem' }}>
                    {order.orderItems && order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          padding: '0.75rem',
                          borderBottom: '1px solid var(--border-color)',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={`http://localhost:5000${item.product.image_url}`}
                          alt={item.product.name}
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'cover',
                            borderRadius: '0.375rem'
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {formatPrice(item.price)} x {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex-between" style={{ borderTop: '2px solid var(--border-color)', paddingTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Total Pembayaran
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {formatPrice(order.total_amount)}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Metode: {order.payment_method === 'cash' ? 'Cash (COD)' : order.payment_method === 'transfer' ? 'Transfer Bank' : 'E-Wallet'}
                      </div>
                    </div>

                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Batalkan Pesanan
                      </button>
                    )}
                  </div>

                  {order.notes && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--light-color)', borderRadius: '0.375rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                        Catatan:
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {order.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .flex-between {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </>
  );
}
