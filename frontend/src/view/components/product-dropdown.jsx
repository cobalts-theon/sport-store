import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function ProductDropdown({ setMobileOpen }) {
  const [hoveredText, setHoveredText] = useState('PRIMESOULS');
  const [hoveredImage, setHoveredImage] = useState('/src/assets/icon/sales.svg');
  const location = useLocation();
  const isActive = location.pathname === '/products';

  return (
    <div className="has-dropdown">
      <Link to="/products" id="products">
        <span className={`nav-link-label ${isActive ? 'active-link' : ''}`}>Products</span>
      </Link>
      {/* empty panel, stays visible when mouse is over it because it's a child of .has-dropdown */}
      {!isActive && (
        <div className="product-panel" onMouseDown={(e) => e.stopPropagation()}>
          <div className="first-rectangle-image">
            <img src={hoveredImage} alt={hoveredText} className="rectangle-image" />
          </div>
          <div className="second-rectangle">
            <h1 className="second-rectangle-text">{hoveredText}</h1>
          </div>
          <div className="product-panel-grid">
            <div className="product-category">
              <h3>Status</h3>
              <Link 
                to="/products?status=sale" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SALE');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Sale
              </Link>
              <Link 
                to="/products?status=new" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('NEW ARRIVALS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                New Arrivals
              </Link>
              <Link 
                to="/products?status=featured" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('FEATURED');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Featured
              </Link>
              <Link 
                to="/products?status=hot-deal" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('HOT DEALS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Hot Deals
              </Link>
            </div>
            <div className="product-category">
              <h3>Category</h3>
              <Link 
                to="/products?category=Sneakers" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SNEAKERS');
                  setHoveredImage('/src/assets/image/shoess.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Sneakers
              </Link>
              <Link 
                to="/products?category=Running" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('RUNNING');
                  setHoveredImage('/src/assets/image/running.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Running
              </Link>
              <Link 
                to="/products?category=Basketball" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('BASKETBALL');
                  setHoveredImage('/src/assets/image/5.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Basketball
              </Link>
              <Link
                to="/products?category=Training" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('TRAINING');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Training
              </Link>
              <Link
                to="/products?category=Lifestyle" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('LIFESTYLE');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Lifestyle
              </Link>
              <Link
                to="/products?category=Apparel" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('APPAREL');
                  setHoveredImage('/src/assets/image/unnamed.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Apparel
              </Link>
              <Link
                to="/products?category=Accessories" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('ACCESSORIES');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Accessories
              </Link>
            </div>
            <div className="product-category">
              <h3>Price</h3>
              <Link 
                to="/products?price=under500k" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('UNDER 500K');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Under 500k
              </Link>
              <Link 
                to="/products?price=500k-1m" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('500K - 1M');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                500k - 1M
              </Link>
              <Link 
                to="/products?price=over1m" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('OVER 1M');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Over 1M
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDropdown;

