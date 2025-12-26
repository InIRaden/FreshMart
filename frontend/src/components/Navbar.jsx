import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaStore, FaUserShield } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <FaStore className="brand-icon" />
            <span>Fresh Mart</span>
          </Link>

          <div className="navbar-menu">
            <Link to="/" className="nav-link">Beranda</Link>
            <Link to="/shop" className="nav-link">Belanja</Link>

            {isAuthenticated ? (
              <>
                {!isAdmin && (
                  <>
                    <Link to="/my-orders" className="nav-link">Pesanan Saya</Link>
                    <Link to="/cart" className="nav-link cart-link">
                      <FaShoppingCart />
                      {getCartItemsCount() > 0 && (
                        <span className="cart-badge">{getCartItemsCount()}</span>
                      )}
                    </Link>
                  </>
                )}

                {isAdmin && (
                  <Link to="/admin" className="nav-link admin-link">
                    <FaUserShield /> Admin Panel
                  </Link>
                )}

                <div className="user-menu">
                  <button className="user-button">
                    <FaUser /> {user.name}
                  </button>
                  <div className="dropdown-menu">
                    <button onClick={handleLogout} className="dropdown-item">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
