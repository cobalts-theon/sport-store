import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import pswhitelogo from "/src/assets/image/white-logo.png";
import "./components-style/navbar.css";
import ProductDropdown from "./product-dropdown";

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faTimes, faPlay, faPause, faBox, faCartShopping } from '@fortawesome/free-solid-svg-icons';

//Audio
import backgroundMusic from '/src/assets/audio/Memory-Reboot-Hatsune-Miku&Shrek.mp3';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const searchRef = useRef(null); // Dùng để phát hiện click ngoài search box
  const audioRef = useRef(new Audio(backgroundMusic));
  const location = useLocation(); // Get current path

  //giảm âm lượng
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.1; // Giảm âm lượng xuống 20%
  }, []);
  
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
          <Link to="/">
            <span className={`nav-link-label ${location.pathname === '/' ? 'active-link' : ''}`}>Home</span>
          </Link>

          {/* Products with full-width hover panel */}
          <ProductDropdown setMobileOpen={setMobileOpen} />
          
          <Link to="/services">
            <span className={`nav-link-label ${location.pathname === '/services' ? 'active-link' : ''}`}>Help</span>
          </Link>
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
          className={`music-button ${musicPlaying ? 'playing' : 'paused'}`} // Thêm class để thay đổi giao diện khi đang phát nhạc
          onClick={() => {
            // Chuyển đổi trạng thái phát nhạc
            if (musicPlaying) {
              audioRef.current.pause(); // Tạm dừng nhạc
            } else {
              audioRef.current.volume = 0.1;  // Đảm bảo âm lượng thấp khi bắt đầu phát
              audioRef.current.play();  // Phát nhạc
              audioRef.current.loop = true; // Lặp lại nhạc
            }
            setMusicPlaying(v => !v);
          }}
          type="button"
        >
          <FontAwesomeIcon icon={musicPlaying ? faPause : faPlay} className="nav-music-icon" />
          <span className="music-visualizer">
            <span className="bar1"></span>  
            <span className="bar2"></span>
            <span className="bar3"></span>
            <span className="bar4"></span>
            <span className="bar5"></span>
          </span>
        </button>

        {/* --- USER ICON --- */}
        <div className="nav-links" id="alter">
          <Link to="/order" className={`order-icon ${location.pathname === '/order' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faBox} className="nav-user-icon"/>
          </Link>
          <Link to="/cart" className={`order-icon ${location.pathname === '/cart' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faCartShopping} className="nav-user-icon"/>
          </Link>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}> 
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
            
            {/* Search bar in mobile panel - always expanded */}
            <div className="mobile-search-container">
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <FontAwesomeIcon icon={faSearch} className="mobile-search-icon" />
            </div>

            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link to="/order" onClick={() => setMobileOpen(false)}>Order<FontAwesomeIcon icon={faBox} /></Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)}>Cart<FontAwesomeIcon icon={faCartShopping} /></Link>
            <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile<FontAwesomeIcon icon={faUser} /></Link>

            {/* Music button at bottom of mobile panel */}
            <button
              className={`mobile-music-button ${musicPlaying ? 'playing' : 'paused'}`}
              onClick={() => {
                if (musicPlaying) {
                  audioRef.current.pause();
                } else {
                  audioRef.current.volume = 0.1;
                  audioRef.current.play();
                  audioRef.current.loop = true;
                }
                setMusicPlaying(v => !v);
              }}
              type="button"
            >
              <FontAwesomeIcon icon={musicPlaying ? faPause : faPlay} className="mobile-music-icon" />
              <span className="mobile-music-text">{musicPlaying ? 'Pause Music' : 'Play Music'}</span>
              <span className="mobile-music-visualizer">
                <span className="bar1"></span>
                <span className="bar2"></span>
                <span className="bar3"></span>
                <span className="bar4"></span>
                <span className="bar5"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
