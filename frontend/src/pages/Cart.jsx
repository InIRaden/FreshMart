// Ini placeholder doang, nanti bisa diimprove lagi
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

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

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
          <FaShoppingBag style={{ fontSize: '4rem', color: 'var(--text-secondary)', marginBottom: '1rem' }} />
          <h2>Keranjang Belanja Kosong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Belum ada produk di keranjang Anda
          </p>
          <Link to="/shop" className="btn btn-primary">
            Mulai Belanja
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
        <div className="flex-between mb-3">
          <h1>Keranjang Belanja</h1>
          <button className="btn btn-danger btn-sm" onClick={clearCart}>
            <FaTrash /> Kosongkan Keranjang
          </button>
        </div>

        <div className="card">
          <div className="cart-items">
            {cart.map((item) => {
              const finalPrice = getFinalPrice(item);
              const subtotal = finalPrice * item.quantity;

              return (
                <div key={item.id} className="cart-item">
                  <img 
                    src={`http://localhost:5000${item.image_url}`} 
                    alt={item.name}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '0.5rem' }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{item.name}</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div>
                        {item.discount_percentage > 0 ? (
                          <>
                            <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                              {formatPrice(item.price)}
                            </span>
                            <span style={{ marginLeft: '0.5rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                              {formatPrice(finalPrice)}
                            </span>
                            <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>
                              -{item.discount_percentage}%
                            </span>
                          </>
                        ) : (
                          <span style={{ fontWeight: 'bold' }}>{formatPrice(finalPrice)}</span>
                        )}
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '0.25rem' }}>/{item.unit}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: 'bold' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        {formatPrice(subtotal)}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromCart(item.id)}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="card-footer">
            <div className="flex-between" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              <span>Total:</span>
              <span style={{ color: 'var(--primary-color)' }}>{formatPrice(getCartTotal())}</span>
            </div>
            <button 
              className="btn btn-primary btn-lg mt-2" 
              style={{ width: '100%' }}
              onClick={() => navigate('/checkout')}
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.5rem;
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          background: var(--light-color);
        }

        @media (max-width: 640px) {
          .cart-item {
            flex-direction: column;
          }

          .cart-item img {
            width: 100%;
            height: 150px;
          }
        }
      `}</style>
    </>
  );
}
