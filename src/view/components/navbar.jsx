import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import pswhitelogo from "/src/assets/image/white-logo.png";
import "./components-style/navbar.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faTimes, faMusic } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null); // Dùng để phát hiện click ngoài search box

  // Theo dõi cuộn trang
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng search box khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-open' : 'not-mobile-open'}`}>
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <img src={pswhitelogo} alt="logo"/>
          <h1>Prime Souls</h1>
        </Link>

        <div className="nav-links" id="main">
          <Link to="/">Home</Link>
          <Link to="/products" id="products">Products</Link>
          <Link to="/services">Services</Link>
        </div>

        {/* --- SEARCH BUTTON --- */}
        <button 
            ref={searchRef}
            className={`search-button ${searchOpen ? 'active' : ''}`}
            onClick={() => {
              if (searchOpen) setSearchQuery('');
              setSearchOpen(v => !v);
            }}
            type="button"
        >
            <FontAwesomeIcon 
              icon={searchOpen ? faTimes : faSearch}  
              className="search-icon"
            />

            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                // Fix Space không đóng search box
                if (e.key === ' ' || e.code === 'Space') {
                  e.preventDefault();
                  e.stopPropagation();
                  setSearchQuery((prev) => prev + ' ');
                }
              }}
              autoComplete="off"
            />
        </button>

        {/* music play */}

        <button
          className="music-button"
          onClick={(e) => { e.stopPropagation(); toggleMusic?.(); }}
          type="button"
        >
          <FontAwesomeIcon icon={faMusic} className="nav-music-icon" />
          <span className="music visualizer">
            <span className="bar1"></span>  
            <span className="bar2"></span>
            <span className="bar3"></span>
            <span className="bar4"></span>
            <span className="bar5"></span>
          </span>
        </button>

        {/* --- USER ICON --- */}
        <div className="nav-links" id="alter">
          <Link to="/login"> 
            <FontAwesomeIcon icon={faUser} className="nav-user-icon"/> 
          </Link>
        </div>

        {/* --- MOBILE MENU --- */}
        <div className="nav-mobile-menu">
          <button
            className={`nav-mobile-button ${mobileOpen ? 'open' : 'close'}`}
            onClick={() => setMobileOpen(v => !v)}   
          >
            <h2>{mobileOpen ? 'Close' : 'Menu'}</h2>
          </button>

          <div className={`nav-mobile-panel ${mobileOpen ? 'open' : ''} ${scrolled ? 'mobile-scrolled' : 'mobile-not-scrolled'}`}>
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
