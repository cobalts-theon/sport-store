import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './components-style/product-card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faFire } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

const API_BASE = 'http://localhost:3000';

function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Get image URL - handle both API paths and static paths
  const getImageUrl = (imgPath) => {
    if (!imgPath) return '';
    if (imgPath.startsWith('http')) return imgPath;
    if (imgPath.startsWith('/uploads')) return `${API_BASE}${imgPath}`;
    return imgPath;
  };

  const imageUrl = getImageUrl(product.img || product.image);
  
  // Debug log
  console.log('Product:', product.name, 'Image path:', product.img, 'Final URL:', imageUrl);

  // Calculate discount percentage if there's an original price
  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const hasDiscount = discountPercentage > 0;
  // Hot deal if explicitly marked OR has significant discount (>=20%)
  const isHotDeal = product.isHotDeal === true || discountPercentage >= 20;

  // Format price with thousand separators
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN') + 'đ';
    }
    return price;
  };

  const handleQuickView = (e) => {
    e.preventDefault(); 
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Thêm sản phẩm vào giỏ với số lượng 1, không có size/color được chọn
    // Nếu sản phẩm cần chọn size, chuyển đến trang chi tiết sản phẩm
    const needsSize = ['shoes', 'sneakers', 'running', 'basketball', 'training', 'lifestyle', 
                       'clothing', 'apparel', 't-shirt', 'shirt', 'jacket', 'hoodie', 'pants', 'shorts']
                      .includes(product.category?.toLowerCase());
    
    if (needsSize) {
      // Nếu cần chọn size, chuyển đến trang chi tiết
      navigate(`/product/${product.id}`);
    } else {
      // Nếu không cần size (phụ kiện...), thêm trực tiếp vào giỏ
      addToCart(product, 1, null, null);
    }
  };

  return (
    <div
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Product Tag */}
      <span className={`product-tag ${product.tag}`}>
        {product.tag.toUpperCase()}
      </span>

      {/* Hot Deal Badge */}
      {isHotDeal && (
        <span className="hot-deal-badge">
          <FontAwesomeIcon icon={faFire} /> HOT DEAL
        </span>
      )}

      {/* Discount Percentage Badge */}
      {hasDiscount && (
        <span className="discount-badge">
          -{discountPercentage}%
        </span>
      )}

      {/* Product Image */}
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} className="product-image-link">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="product-image"
        />
        </Link>
        <div className="product-overlay">
          <button 
            className="quick-view-btn"
            onClick={handleQuickView}
          >
            <span className="btn-text">Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info-card">
        <span className="product-category-card-item">{product.category}</span>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 className="product-name" style={{ fontSize: '20px'}}>{product.name}</h3>
        </Link>

        <div className="product-bottom">
          <div className="price-container">
            {hasDiscount ? (
              <>
                <span className="product-price-original">{formatPrice(product.originalPrice)}</span>
                <span className="product-price" style={{ fontSize: '24px' }}>{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="product-price" style={{ fontSize: '24px'}}>{formatPrice(product.price)}</span>
            )}
          </div>
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
          >
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
