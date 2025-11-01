import { useState } from 'react';
import { Link } from 'react-router-dom';
import './pages-style/home-product.css';
import ProductCard from '../components/product-card';

// Import images
import basketball from '/src/assets/image/basketball.png';
import football from '/src/assets/image/football(glitch).png';
import shoe from '/src/assets/image/shoe.png';
import volleyball from '/src/assets/image/volleyball(graffiti).png';
import waterbottle from '/src/assets/image/waterbottle(orange).png';
import img1 from '/src/assets/image/1.png';
import img2 from '/src/assets/image/2.png';
import img5 from '/src/assets/image/5.jpg';
import img6 from '/src/assets/image/6.jpg';
import img7 from '/src/assets/image/7.jpg';
import img8 from '/src/assets/image/8.jpg';

/**
 * Home Product Page - Hiển thị các sản phẩm trong grid layout
 * với animation và style hiện đại
 */
function HomeProduct() {
  const [filter, setFilter] = useState('all'); // all, featured, new, sale

  // Danh sách sản phẩm
  const products = [
    {
      id: 1,
      name: 'PS C12 Basic Basketball',
      category: 'Basketball',
      price: 350000,
      originalPrice: 500000,
      image: basketball,
      tag: 'featured',
      description: 'Premium basketball for professional players',
      isHotDeal: true
    },
    {
      id: 2,
      name: 'PS GlitchX Football',
      category: 'Football',
      price: 450000,
      image: football,
      tag: 'new',
      description: 'Advanced glitch design for better grip'
    },
    {
      id: 3,
      name: 'PS LXCX Trainer',
      category: 'Shoes',
      price: 680000,
      originalPrice: 850000,
      image: shoe,
      tag: 'featured',
      description: 'Ultimate training shoes for athletes'
    },
    {
      id: 4,
      name: 'PS V675 Volleyball',
      category: 'Volleyball',
      price: 240000,
      originalPrice: 320000,
      image: volleyball,
      tag: 'sale',
      description: 'Professional volleyball with graffiti style',
      isHotDeal: true
    },
    {
      id: 5,
      name: 'PS (O) Water Bottle',
      category: 'Accessories',
      price: 150000,
      image: waterbottle,
      tag: 'new',
      description: 'Stylish water bottle for hydration'
    },
    {
      id: 6,
      name: 'PS Pro Running Shoes',
      category: 'Shoes',
      price: 760000,
      originalPrice: 950000,
      image: img1,
      tag: 'featured',
      description: 'Elite running shoes for speed'
    },
    {
      id: 7,
      name: 'PS Elite Jersey',
      category: 'Clothing',
      price: 550000,
      image: img2,
      tag: 'new',
      description: 'Breathable performance jersey'
    },
    {
      id: 8,
      name: 'PS Basketball Shoes',
      category: 'Shoes',
      price: 890000,
      image: img5,
      tag: 'featured',
      description: 'High-top basketball sneakers'
    },
    {
      id: 9,
      name: 'PS Training Gear',
      category: 'Accessories',
      price: 465000,
      originalPrice: 620000,
      image: img6,
      tag: 'sale',
      description: 'Complete training equipment set',
      isHotDeal: true
    },
    {
      id: 10,
      name: 'PS Sport Watch',
      category: 'Accessories',
      price: 750000,
      image: img7,
      tag: 'new',
      description: 'Smart sports tracking watch'
    },
    {
      id: 11,
      name: 'PS Running Cap',
      category: 'Accessories',
      price: 180000,
      image: img8,
      tag: 'featured',
      description: 'Lightweight performance cap'
    },
    {
      id: 12,
      name: 'PS Training Shoes',
      category: 'Shoes',
      price: 585000,
      originalPrice: 780000,
      image: shoe,
      tag: 'sale',
      description: 'Versatile training footwear',
      isHotDeal: true
    }
  ];

  // Lọc sản phẩm theo tag
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(product => product.tag === filter);

  return (
    <div className="home-product-container">
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
            <span className="filter-btn-text">All Products</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'featured' ? 'active' : ''}`}
            onClick={() => setFilter('featured')}
          >
            <span className="filter-btn-text">Featured</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            <span className="filter-btn-text">New Arrivals</span>
          </button>
          <button 
            className={`filter-btn ${filter === 'sale' ? 'active' : ''}`}
            onClick={() => setFilter('sale')}
          >
            <span className="filter-btn-text">On Sale</span>
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
            <span className="cta-button-text">Shop All Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomeProduct;
