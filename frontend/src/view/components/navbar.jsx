import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import pswhitelogo from "/src/assets/image/white-logo.png";
import "./components-style/navbar.css";

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faTimes, faPlay, faPause, faBox, faCartShopping, faVenus, faMars} from '@fortawesome/free-solid-svg-icons';

//Audio
import backgroundMusic from '/src/assets/audio/Memory-Reboot-Hatsune-Miku&Shrek.mp3';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);  
  const [searchQuery, setSearchQuery] = useState('');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [hoveredText, setHoveredText] = useState('PRIMESOULS'); //Gọi tên hiện tại của link
  const [hoveredImage, setHoveredImage] = useState('/src/assets/icon/sales.svg'); //Hình ảnh mặc định
  const searchRef = useRef(null); // Dùng để phát hiện click ngoài search box
  const audioRef = useRef(new Audio(backgroundMusic));

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
          <Link to="/"><span className="nav-link-label">Home</span></Link>

          {/* Products with full-width hover panel */}
          <div className="has-dropdown">
            <Link to="/products" id="products"><span className="nav-link-label">Products</span></Link>
            {/* empty panel, stays visible when mouse is over it because it's a child of .has-dropdown */}
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
                      setHoveredText('CLOTHES');
                      setHoveredImage('/src/assets/image/unnamed.jpg');
                    }}
                    onMouseLeave={() => {
                      setHoveredText('PRIMESOULS');
                      setHoveredImage('/src/assets/icon/sales.svg');
                    }}
                  >
                    Clothes
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
          </div>
          <Link to="/services"><span className="nav-link-label">Help</span></Link>
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
          <Link to="/order" className="order-icon">
            <FontAwesomeIcon icon={faBox} className="nav-user-icon"/>
          </Link>
          <Link to="/cart" className="order-icon">
            <FontAwesomeIcon icon={faCartShopping} className="nav-user-icon"/>
          </Link>
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
