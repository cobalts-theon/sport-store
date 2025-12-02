import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import pswhitelogo from "/src/assets/image/white-logo.png";
import "./components-style/navbar.css";
import ProductDropdown from "./product-dropdown";
import CartDrawer from "./cart-drawer";
import HelpDropdown from "./help-dropdown";
import { useCart } from '../context/CartContext';
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faTimes, faPlay, faPause, faBox, faCartShopping } from '@fortawesome/free-solid-svg-icons';

//Audio
import backgroundMusic from '/src/assets/audio/theme.mp3';

// Default avatar as inline SVG data URI
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect fill='%23374151' width='40' height='40' rx='20'/%3E%3Ccircle cx='20' cy='15' r='8' fill='%239CA3AF'/%3E%3Cellipse cx='20' cy='38' rx='14' ry='12' fill='%239CA3AF'/%3E%3C/svg%3E";

function Navbar({ cartOpen, setCartOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);  
  const [searchQuery, setSearchQuery] = useState(''); //Khai báo biến searchQuery để lưu giá trị tìm kiếm và setState để cập nhật giá trị 
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kiểm tra đăng nhập
  const [userAvatar, setUserAvatar] = useState(null); // Avatar của user
  const searchRef = useRef(null); // Dùng để phát hiện click ngoài search box
  const audioRef = useRef(new Audio(backgroundMusic));
  const location = useLocation(); // Get current path
  const navigate = useNavigate();
  const { getCartCount } = useCart(); // Lấy số lượng sản phẩm trong giỏ hàng

  // Kiểm tra trạng thái đăng nhập và lấy avatar
  useEffect(() => {
    const updateUserState = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          if (user.avatar) {
            const avatarUrl = user.avatar.startsWith('http') 
              ? user.avatar 
              : `http://localhost:3000/${user.avatar}`;
            setUserAvatar(avatarUrl);
          } else {
            setUserAvatar(null);
          }
        } catch (e) {
          setUserAvatar(null);
        }
      } else {
        setUserAvatar(null);
      }
    };

    // Initial check
    updateUserState();

    // Listen for storage changes (e.g., when avatar is updated in profile)
    window.addEventListener('storage', updateUserState);
    
    // Custom event for same-tab updates
    window.addEventListener('userUpdated', updateUserState);

    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('userUpdated', updateUserState);
    };
  }, [location]); // Cập nhật khi đổi route

  // Lấy query từ URL params và cập nhật giá trị searchQuery
  useEffect(() => {
    const params = new URLSearchParams(location.search); //Lấy URL params
    const query = params.get('search') || ''; //Lấy query từ URL params
    setSearchQuery(query); //Cập nhật giá trị searchQuery
    if (query) setSearchOpen(true); //Nếu có query thì mở search box
  }, [location.search, location.pathname]); //Khi URL params thay đổi thì cập nhật giá trị searchQuery

  //Chức năng tìm kiếm
  const handleSearch = () => {
    if (searchQuery.trim()) { //Nếu có query thì chuyển hướng đến trang products và truyền query tìm kiếm
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`); //Chuyển hướng đến trang products và truyền query tìm kiếm
      setSearchOpen(false); //Đóng search box
      setMobileOpen(false); //Đóng mobile menu  
    }
  };

  //giảm âm lượng
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.2; // Giảm âm lượng xuống 20%
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
    <>
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
          <HelpDropdown setMobileOpen={setMobileOpen} />
        </div>

        {/* --- SEARCH BUTTON --- */}
        <button 
            ref={searchRef}
            className={`search-button ${searchOpen ? 'active' : ''}`} //Thêm class để thay đổi giao diện khi search box đang mở
            onClick={() => {
              if (searchOpen) setSearchQuery(''); //Nếu search box đang mở thì xóa query
              setSearchOpen(v => !v); //Mở/Đóng search box
            }}
            type="button"
        >
            <FontAwesomeIcon 
              icon={searchOpen ? faTimes : faSearch}  
              className="search-icon"
              onClick={(e) => {
                if (searchOpen && searchQuery.trim()) {
                  e.stopPropagation(); //Ngăn không cho event bubble lên button parent
                  handleSearch(); //Thực hiện tìm kiếm khi click vào icon search
                }
              }}
              style={{ cursor: searchOpen && searchQuery.trim() ? 'pointer' : 'default' }}
            />

            <input
              type="text"
              placeholder="Search for products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} //Cập nhật giá trị searchQuery khi người dùng nhập
              onClick={(e) => e.stopPropagation()} //Ngăn không cho event bubble lên button parent
              onFocus={() => setSearchOpen(true)} //Mở search box khi focus vào input
              onKeyDown={(e) => {
                if (e.key === 'Enter') { //Khi nhấn Enter thì thực hiện tìm kiếm
                  handleSearch();
                }
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
              audioRef.current.volume = 0.3;  // Đảm bảo âm lượng thấp khi bắt đầu phát
              audioRef.current.play();  // Phát nhạc
              audioRef.current.loop = true; // Lặp lại nhạc
            }
            setMusicPlaying(v => !v);
          }}
          type="button"
        >
          <span className="music-visualizer">
            <span className="bar1"></span>  
            <span className="bar2"></span>
            <span className="bar3"></span>
            <span className="bar4"></span>
            <span className="bar5"></span>
          </span>
          <FontAwesomeIcon icon={musicPlaying ? faPause : faPlay} className="nav-music-icon" />
        </button>

        {/* --- USER ICON --- */}
        <div className="nav-links" id="alter">
          <Link to="/order" className={`order-icon ${location.pathname === '/order' ? 'active' : ''}`}>
            <FontAwesomeIcon icon={faBox} className="nav-user-icon"/>
          </Link>
          <Link 
            to="#" 
            className={`order-icon ${cartOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              if (setCartOpen) setCartOpen(true);
            }}
          >
            <FontAwesomeIcon icon={faCartShopping} className="nav-user-icon"/>
            {getCartCount() > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </Link>
          <Link to={isLoggedIn ? "/profile" : "/login"} className={`nav-user-link ${location.pathname === '/login' || location.pathname === '/profile' ? 'active' : ''}`}> 
            {isLoggedIn ? (
              <img 
                src={userAvatar || DEFAULT_AVATAR} 
                alt="User Avatar" 
                className="nav-user-avatar"
                onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
              />
            ) : (
              <FontAwesomeIcon icon={faUser} className="nav-user-icon"/>
            )}
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
                onChange={(e) => setSearchQuery(e.target.value)} //Cập nhật giá trị searchQuery
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch(); //Khi nhấn Enter thì thực hiện tìm kiếm
                }}
                className="mobile-search-input"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="mobile-search-icon" 
                onClick={handleSearch} //Thực hiện tìm kiếm khi click vào icon search
                style={{ cursor: 'pointer' }}
              />
            </div>

            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMobileOpen(false)}>Products</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)}>Services</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
            <Link to="/order" onClick={() => setMobileOpen(false)}>Order</Link>
            <Link 
              to="#" 
              onClick={(e) => {
                e.preventDefault();
                setMobileOpen(false);
                if (setCartOpen) setCartOpen(true);
              }}
            >
              Cart
            </Link>
            <Link to={isLoggedIn ? "/profile" : "/login"} onClick={() => setMobileOpen(false)} className="mobile-user-link">
              {isLoggedIn ? (
                <>
                  <img 
                    src={userAvatar || DEFAULT_AVATAR} 
                    alt="User Avatar" 
                    className="mobile-user-avatar"
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
                  />
                  Profile
                </>
              ) : (
                <>Login<FontAwesomeIcon icon={faUser} /></>
              )}
            </Link>

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
    <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen && setCartOpen(false)} />
    </>
  );
}

export default Navbar;
