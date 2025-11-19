import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenus, faMars } from '@fortawesome/free-solid-svg-icons';

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
              <h3>Categories</h3>
              <Link 
                to="/products?category=shoes" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SHOES');
                  setHoveredImage('/src/assets/image/shoess.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Shoes
              </Link>
              <Link 
                to="/products?category=clothes" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SHIRTS');
                  setHoveredImage('/src/assets/image/unnamed.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS');
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Shirts
              </Link>
              <Link 
                to="/products?category=shorts" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SHORTS');
                  setHoveredImage('/src/assets/image/Shortss.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Shorts
              </Link>
              <Link
                to="/products?category=bottle" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('BOTTLE')
                  setHoveredImage('/src/assets/image/Sport-water.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Bottle
              </Link>
              <Link
                to="/products?category=sock" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SOCK')
                  setHoveredImage('/src/assets/image/Sock.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Sock
              </Link>
              <Link
                to="/products?category=hat" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('HAT')
                  setHoveredImage('/src/assets/image/Hat.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Hat
              </Link>
              <Link
                to="/products?category=paddle" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('PADDLE')
                  setHoveredImage('/src/assets/image/Paddle.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Paddle
              </Link>
              <Link
                to="/products?category=bag" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('BAG')
                  setHoveredImage('/src/assets/image/Bag.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Bag
              </Link>
              <Link
                to="/products?category=dumbbell" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('DUMBBELL')
                  setHoveredImage('/src/assets/image/Dumbbell.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Dumbbell
              </Link>
            </div>
            <div className="product-category">
              <h3>By Sport</h3>
              <Link 
                to="/products?sport=running" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('RUNNING')
                  setHoveredImage('/src/assets/image/running.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');}}
              >
                Running
              </Link>
              <Link 
                to="/products?sport=basketball" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('BASKETBALL')
                  setHoveredImage('/src/assets/image/5.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Basketball
              </Link>
              <Link 
                to="/products?sport=soccer" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('SOCCER')
                  setHoveredImage('/src/assets/image/Soccer.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Soccer
              </Link>
              <Link 
                to="/products?sport=skateboarding" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('PICKLEBALL')
                  setHoveredImage('/src/assets/image/pickle.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Pickleball
              </Link>
              <Link 
                to="/products?sport=volleyball" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('VOLLEYBALL')
                  setHoveredImage('/src/assets/image/volleyballs.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Volleyball
              </Link>
              <Link 
                to="/products?sport=tennis" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('TENNIS')
                  setHoveredImage('/src/assets/image/6.jpg');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Tennis
              </Link>
              <Link 
                to="/products?sport=baseball" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('BASEBALL')
                  setHoveredImage('/src/assets/image/about2.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Baseball
              </Link>
            </div>
            <div className="product-category">
              <h3>Target</h3>
              <Link 
                to="/products?target=men" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('MEN')
                  setHoveredImage('/src/assets/image/Male.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Men <FontAwesomeIcon icon={faMars}/>
              </Link>
              <Link 
                to="/products?target=women" 
                className="product-link" 
                onClick={() => setMobileOpen(false)}
                onMouseEnter={() => {
                  setHoveredText('WOMEN')
                  setHoveredImage('/src/assets/image/Female.png');
                }}
                onMouseLeave={() => {
                  setHoveredText('PRIMESOULS')
                  setHoveredImage('/src/assets/icon/sales.svg');
                }}
              >
                Women <FontAwesomeIcon icon={faVenus}/>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDropdown;

