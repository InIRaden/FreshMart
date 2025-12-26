import React from 'react';
import { FaShoppingCart, FaTag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast.warning('Produk habis');
      return;
    }

    addToCart(product, 1);
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const getFinalPrice = () => {
    if (product.discount_percentage > 0) {
      return product.price * (1 - product.discount_percentage / 100);
    }
    return product.price;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {product.discount_percentage > 0 && (
          <div className="discount-badge">
            <FaTag /> {product.discount_percentage}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">Habis</div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category?.name}</p>

        <div className="product-price">
          {product.discount_percentage > 0 ? (
            <>
              <span className="original-price">{formatPrice(product.price)}</span>
              <span className="final-price">{formatPrice(getFinalPrice())}</span>
            </>
          ) : (
            <span className="final-price">{formatPrice(product.price)}</span>
          )}
          <span className="product-unit">/ {product.unit}</span>
        </div>

        <div className="product-stock">
          Stok: <strong>{product.stock}</strong> {product.unit}
        </div>

        <button
          className="btn btn-primary btn-block"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <FaShoppingCart /> Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
