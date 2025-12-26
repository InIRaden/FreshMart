import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FaEye, FaCheck, FaTruck, FaBan, FaClock, FaBox } from 'react-icons/fa';
import '../admin/Admin.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
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
      delivered: { class: 'badge-success', icon: <FaCheck />, text: 'Selesai' },
      cancelled: { class: 'badge-danger', icon: <FaBan />, text: 'Dibatalkan' }
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Status pesanan berhasil diupdate');
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setShowDetailModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/payment`, { payment_status: newStatus });
      toast.success('Status pembayaran berhasil diupdate');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate pembayaran');
    }
  };

  const viewOrderDetail = async (order) => {
    try {
      const response = await api.get(`/orders/${order.id}`);
      setSelectedOrder(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      toast.error('Gagal memuat detail pesanan');
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Kelola Pesanan</h1>
        </div>

        <div className="admin-actions">
          <select
            className="form-control"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ maxWidth: '250px' }}
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
        ) : (
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No. Pesanan</th>
                    <th>Customer</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Pembayaran</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '500' }}>{order.order_number}</td>
                      <td>
                        <div>{order.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {order.user?.email}
                        </div>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                        {formatPrice(order.total_amount)}
                      </td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{getPaymentBadge(order.payment_status)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => viewOrderDetail(order)}
                        >
                          <FaEye /> Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {orders.length === 0 && (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Belum ada pesanan
                </div>
              )}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
              <div className="modal-header">
                <h2>Detail Pesanan</h2>
                <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
              </div>

              <div>
                {/* Order Info */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--light-color)', borderRadius: '0.5rem' }}>
                  <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>No. Pesanan</div>
                      <div style={{ fontWeight: '600' }}>{selectedOrder.order_number}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tanggal</div>
                      <div>{formatDate(selectedOrder.created_at)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status Pesanan</div>
                      <div>{getStatusBadge(selectedOrder.status)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status Pembayaran</div>
                      <div>{getPaymentBadge(selectedOrder.payment_status)}</div>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Informasi Customer</h3>
                  <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                    <div><strong>Nama:</strong> {selectedOrder.user?.name}</div>
                    <div><strong>Email:</strong> {selectedOrder.user?.email}</div>
                    <div><strong>Telepon:</strong> {selectedOrder.user?.phone || '-'}</div>
                    <div><strong>Alamat:</strong> {selectedOrder.shipping_address}</div>
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Item Pesanan</h3>
                  <div style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                    {selectedOrder.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          padding: '1rem',
                          borderBottom: '1px solid var(--border-color)',
                          alignItems: 'center'
                        }}
                      >
                        <img
                          src={`http://localhost:5000${item.product.image_url}`}
                          alt={item.product.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.375rem' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500' }}>{item.product.name}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {formatPrice(item.price)} x {item.quantity}
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>{formatPrice(item.subtotal)}</div>
                      </div>
                    ))}
                    <div style={{ padding: '1rem', background: 'var(--light-color)', fontWeight: 'bold', fontSize: '1.125rem', textAlign: 'right' }}>
                      Total: {formatPrice(selectedOrder.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Metode Pembayaran</h3>
                  <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                    {selectedOrder.payment_method === 'cash' ? 'Cash (COD)' : 
                     selectedOrder.payment_method === 'transfer' ? 'Transfer Bank' : 'E-Wallet'}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Catatan</h3>
                    <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', background: 'var(--light-color)' }}>
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                      >
                        <FaBox /> Proses Pesanan
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      >
                        <FaBan /> Batalkan
                      </button>
                    </>
                  )}

                  {selectedOrder.status === 'processing' && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                    >
                      <FaTruck /> Kirim Pesanan
                    </button>
                  )}

                  {selectedOrder.status === 'shipped' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                    >
                      <FaCheck /> Selesaikan Pesanan
                    </button>
                  )}

                  {selectedOrder.payment_status === 'unpaid' && selectedOrder.status !== 'cancelled' && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'paid')}
                    >
                      <FaCheck /> Konfirmasi Pembayaran
                    </button>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
