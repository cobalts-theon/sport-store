import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxOpen, 
  faUsers, 
  faQuestionCircle
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
      
      {/* Help Panel - Simple Style */}
      {isOpen && (
        <div className="help-panel" onMouseDown={(e) => e.stopPropagation()}>
        
        {/* Grid chứa các link (Content) */}
        <div className="help-panel-grid">
          
          {/* Cột đơn giản */}
          <div className="help-category">
            <h3>Support</h3>
            <Link 
              to="/order" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faBoxOpen}/> Track Order
            </Link>
            <Link 
              to="/about" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faUsers}/> About Us
            </Link>
            <Link 
              to="/faq" 
              className="help-link" 
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faQuestionCircle}/> FAQ
            </Link>
          </div>

        </div>
      </div>
      )}
    </div>
  );
}

export default HelpDropdown;