import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaStore, FaShieldAlt, FaTruck, FaLeaf } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home">
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Selamat Datang di Fresh Mart</h1>
              <p>Belanja bahan makanan segar berkualitas langsung dari petani lokal</p>
              <Link to="/shop" className="btn btn-primary btn-lg">
                Mulai Belanja
              </Link>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Mengapa Memilih Fresh Mart?</h2>
            <div className="grid grid-cols-4">
              <div className="feature-card">
                <FaLeaf className="feature-icon" />
                <h3>Produk Segar</h3>
                <p>Semua produk dipilih langsung dari petani lokal</p>
              </div>
              <div className="feature-card">
                <FaShieldAlt className="feature-icon" />
                <h3>Kualitas Terjamin</h3>
                <p>Produk berkualitas tinggi dan terpercaya</p>
              </div>
              <div className="feature-card">
                <FaTruck className="feature-icon" />
                <h3>Pengiriman Cepat</h3>
                <p>Pengiriman cepat ke seluruh area</p>
              </div>
              <div className="feature-card">
                <FaStore className="feature-icon" />
                <h3>Harga Terbaik</h3>
                <p>Harga kompetitif tanpa perantara</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Siap Berbelanja?</h2>
            <p>Daftarkan diri Anda dan mulai belanja produk segar hari ini!</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Daftar Sekarang
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
