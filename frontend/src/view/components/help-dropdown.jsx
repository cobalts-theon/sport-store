import { useState, useEffect } from "react";
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
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(false);
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleLinkClick = () => {
    setIsOpen(false);
    setMobileOpen(false);
  };

  return (
    <div className="has-dropdown">
      <Link to="#" id="help" onClick={null}>
        <span className="nav-link-label">Help</span>
      </Link>
      
      {/* Help Panel - Simple Order Style */}
      {isOpen && (
        <div className="help-panel" onMouseDown={(e) => e.stopPropagation()}>
        
        {/* Grid chứa các link (Content) */}
        <div className="help-panel-grid">
          
          {/* Cột 1: Hỗ trợ khách hàng */}
          <div className="help-category">
            <h3>Assistance</h3>
            <Link 
              to="/services" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faHeadset}/> Help Center
            </Link>
            <Link 
              to="/contact" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faEnvelope}/> Contact Support
            </Link>
            <Link 
              to="/order" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faBoxOpen}/> Track Order
            </Link>
          </div>
          
          {/* Cột 2: Về thương hiệu */}
          <div className="help-category">
            <h3>The Brand</h3>
            <Link 
              to="/about" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faUsers}/> About Us
            </Link>
            <Link 
              to="/blog" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faNewspaper}/> Blog & News
            </Link>
             <Link 
              to="/careers" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faBriefcase}/> Careers
            </Link>
          </div>

          {/* Cột 3: Pháp lý & Đối tác */}
          <div className="help-category">
            <h3>Legal & B2B</h3>
            <Link 
              to="/terms" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faScaleBalanced}/> Terms of Service
            </Link>
            <Link 
              to="/privacy" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faShieldHalved}/> Privacy Policy
            </Link>
             <Link 
              to="/partnerships" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faHandshake}/> Partnerships
            </Link>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}

export default HelpDropdown;