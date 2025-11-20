import { useState } from 'react';
import { Link } from 'react-router-dom';
import './pages-style/home-product.css';
import ProductCard from '../components/product-card';
import productsData from '../data/products.json';
import Silk from '../components/Silk';

/**
 * Home Product Page - Hiển thị các sản phẩm trong grid layout
 * với animation và style hiện đại
 */
function HomeProduct() {
  const [filter, setFilter] = useState('all'); // all, featured, new, sale

  // Filter products starting from ID 8 for the grid section
  const gridProducts = productsData.filter(p => p.id >= 8);

  // Lọc sản phẩm theo tag
  const filteredProducts = filter === 'all' 
    ? gridProducts.slice(0, 8) // Show only first 8 products for 2 rows of 4
    : gridProducts.filter(product => product.tag === filter).slice(0, 8);

  return (
    <div className="home-product-container">
      <div className="silk-background">
        <Silk
          speed={10}
          scale={2}
          color="#363636"
          noiseIntensity={2}
          rotation={0}
        />
      </div>
      {/* Header Section */}
      <div className="home-product-header">
        <h1 className="home-product-title">
          <span className="title-prime">PRIME</span>
          <span className="title-souls">SOULS</span>
        </h1>
        <p className="home-product-subtitle">Discover Our Premium Collection</p>
        
        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Products
          </button>
          <button 
            className={`filter-btn ${filter === 'featured' ? 'active' : ''}`}
            onClick={() => setFilter('featured')}
          >
            Featured
          </button>
          <button 
            className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            New Arrivals
          </button>
          <button 
            className={`filter-btn ${filter === 'sale' ? 'active' : ''}`}
            onClick={() => setFilter('sale')}
          >
            On Sale
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map((product, index) => (
          <ProductCard 
            key={product.id}
            product={product}
            index={index}
          />
        ))}
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Elevate Your Game?</h2>
          <p className="cta-text">Join thousands of athletes who trust Prime Souls</p>
          <Link to="/products" className="cta-button">
            Shop All Products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
