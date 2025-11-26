import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadset, 
  faEnvelope, 
  faBoxOpen, 
  faUsers, 
  faNewspaper, 
  faBriefcase, 
  faScaleBalanced, 
  faShieldHalved,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';

function HelpDropdown({ setMobileOpen }) {
  // State mặc định
  const defaultText = "SUPPORT HUB";
  const defaultImage = "/src/assets/image/about1.png"; // Ảnh mặc định (About)

  const [hoveredText, setHoveredText] = useState(defaultText);
  const [hoveredImage, setHoveredImage] = useState(defaultImage);
  
  const location = useLocation();
  const isActive = location.pathname.includes('/services') || location.pathname.includes('/about');

  // Hàm xử lý khi hover vào link
  const handleMouseEnter = (text, image) => {
    setHoveredText(text);
    setHoveredImage(image);
  };

  // Hàm xử lý khi chuột rời khỏi link (reset về mặc định)
  const handleMouseLeave = () => {
    setHoveredText(defaultText);
    setHoveredImage(defaultImage);
  };

  return (
    <div className="has-dropdown">
      <Link to="/services" id="help">
        <span className={`nav-link-label ${isActive ? 'active-link' : ''}`}>Help</span>
      </Link>
      
      {/* Panel chính */}
      <div className="product-panel" onMouseDown={(e) => e.stopPropagation()}>
        
        {/* Phần hình ảnh bên phải (First Rectangle) */}
        <div className="first-rectangle-image">
          <img 
            src={hoveredImage} 
            alt={hoveredText} 
            className="rectangle-image" 
            style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
          />
          {/* Overlay tối để text dễ đọc hơn nếu cần */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }}></div>
        </div>

        {/* Phần text dọc bên dưới (Second Rectangle) */}
        <div className="second-rectangle">
          <h1 className="second-rectangle-text">{hoveredText}</h1>
        </div>

        {/* Grid chứa các link (Content) */}
        <div className="product-panel-grid">
          
          {/* Cột 1: Hỗ trợ khách hàng */}
          <div className="product-category">
            <h3>Assistance</h3>
            <Link 
              to="/services" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('SERVICES', '/src/assets/image/blue-orange.png')}
              onMouseLeave={handleMouseLeave}
            >
              Help Center <FontAwesomeIcon icon={faHeadset}/>
            </Link>
            <Link 
              to="/contact" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('CONTACT US', '/src/assets/image/white-logo.png')}
              onMouseLeave={handleMouseLeave}
            >
              Contact Support <FontAwesomeIcon icon={faEnvelope}/>
            </Link>
            <Link 
              to="/order" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('TRACK ORDER', '/src/assets/image/shoe.png')}
              onMouseLeave={handleMouseLeave}
            >
              Track Order <FontAwesomeIcon icon={faBoxOpen}/>
            </Link>
          </div>
          
          {/* Cột 2: Về thương hiệu */}
          <div className="product-category">
            <h3>The Brand</h3>
            <Link 
              to="/about" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('OUR STORY', '/src/assets/image/about2.png')}
              onMouseLeave={handleMouseLeave}
            >
              About Us <FontAwesomeIcon icon={faUsers}/>
            </Link>
            <Link 
              to="/blog" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('LATEST NEWS', '/src/assets/image/running.jpg')} // Giả sử có ảnh này, nếu không dùng ảnh khác
              onMouseLeave={handleMouseLeave}
            >
              Blog & News <FontAwesomeIcon icon={faNewspaper}/>
            </Link>
             <Link 
              to="/careers" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('JOIN TEAM', '/src/assets/image/basketball.png')}
              onMouseLeave={handleMouseLeave}
            >
              Careers <FontAwesomeIcon icon={faBriefcase}/>
            </Link>
          </div>

          {/* Cột 3: Pháp lý & Đối tác */}
          <div className="product-category">
            <h3>Legal & B2B</h3>
            <Link 
              to="/terms" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('TERMS', '/src/assets/image/about1.png')}
              onMouseLeave={handleMouseLeave}
            >
              Terms of Service <FontAwesomeIcon icon={faScaleBalanced}/>
            </Link>
            <Link 
              to="/privacy" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('PRIVACY', '/src/assets/image/about1.png')}
              onMouseLeave={handleMouseLeave}
            >
              Privacy Policy <FontAwesomeIcon icon={faShieldHalved}/>
            </Link>
             <Link 
              to="/partnerships" 
              className="product-link" 
              onClick={() => setMobileOpen(false)}
              onMouseEnter={() => handleMouseEnter('PARTNERS', '/src/assets/image/volleyball.png')}
              onMouseLeave={handleMouseLeave}
            >
              Partnerships <FontAwesomeIcon icon={faHandshake}/>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HelpDropdown;