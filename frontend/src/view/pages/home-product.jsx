import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './pages-style/home-product.css';
import ProductCard from '../components/product-card';
import Silk from '../components/Silk';
import api from '@/lib/api';

/**
 * Home Product Page - Hiển thị các sản phẩm trong grid layout
 * với animation và style hiện đại
 */
function HomeProduct() {

  //Giải thích code: 
  //B1: Khai báo state để lưu trữ sản phẩm và trạng thái loading
  //B2: Sử dụng useEffect để fetch dữ liệu sản phẩm từ API khi component được mount
  //B3: Map dữ liệu API về đúng định dạng cần thiết và lưu vào state products
  //B4: Tạo biến gridProducts để dễ quản lý sản phẩm hiển thị
  //B5: Lọc sản phẩm dựa trên filter hiện tại và chỉ lấy 10 sản phẩm đầu tiên
  //B6: Render giao diện với header, nút lọc, lưới sản phẩm và phần kêu gọi hành động

  const [filter, setFilter] = useState('all'); // all, featured, new, sale
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // map dữ liệu api về đúng định dạng cần thiết
        // API returns: img_url (not img), original_price (not old_price)
        const mappedProducts = response.data.map(p => ({
          id: p.id,
          name: p.name,
          img: p.img_url || p.img, // API returns img_url
          image: p.img_url || p.img,
          price: p.price,
          originalPrice: p.original_price || p.old_price,
          description: p.description,
          category: p.category,
          tag: p.tag || 'new',
          color: p.color,
          material: p.material,
          brand: p.brand,
          stock: p.stock,
          isHotDeal: p.isHotDeal
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Gắn products vào gridProducts để dễ quản lý
  const gridProducts = products;

  // Lọc sản phẩm theo tag
  const filteredProducts = filter === 'all' 
    ? gridProducts.slice(0, 10) // Cho chỉ hiển thị 10 sản phẩm
    : gridProducts.filter(product => product.tag === filter).slice(0, 10);  

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
