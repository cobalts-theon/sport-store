import { useState } from 'react';
import './components-style/product-card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalf, faFire } from '@fortawesome/free-solid-svg-icons';


function ProductCard({ product, index }) {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discount percentage if there's an original price
  const discountPercentage = product.originalPrice && product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const hasDiscount = discountPercentage > 0;
  const isHotDeal = product.isHotDeal || discountPercentage >= 20;

  // Format price with thousand separators
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return price.toLocaleString('vi-VN') + 'đ';
    }
    return price;
  };

  const handleQuickView = () => {
    // TODO: Implement quick view modal
    console.log('Quick view:', product.name);
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.name);
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
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
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
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <div className="price-container">
            {hasDiscount ? (
              <>
                <span className="product-price-original">{formatPrice(product.originalPrice)}</span>
                <span className="product-price">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="product-price">{formatPrice(product.price)}</span>
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

      {/* Decorative Elements */}
      <div className="card-decoration"></div>
    </div>
  );
}

export default ProductCard;

