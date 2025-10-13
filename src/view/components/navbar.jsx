import React, { useState, useEffect } from "react";
import pswhitelogo from "/src/assets/image/white-logo.png";
import "./components-style/navbar.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
  const [scrolled, setScrolled] = useState(false);  // Trạng thái navbar đã cuộn hay chưa
  const [mobileOpen, setMobileOpen] = useState(false);  // Trạng thái menu mobile mở hay đóng

  // Thêm sự kiện lắng nghe cuộn trang để thay đổi trạng thái scrolled
  // Navbar sẽ đổi màu khi người dùng cuộn trang xuống > 10px
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);  // Nếu cuộn > 10px thì scrolled = true
    window.addEventListener('scroll', handleScroll);  // Lắng nghe sự kiện cuộn trang
    return () => window.removeEventListener('scroll', handleScroll);  // Cleanup khi component unmount
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'mobile-open' : 'not-mobile-open'}`}>
      <div className="nav-content">
        <div className="nav-logo" onClick={() => window.location.reload()}>
          <img src={pswhitelogo} alt="logo"/>
          <h1>Prime Souls</h1>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">Products</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <a href="#profile"> <FontAwesomeIcon icon={faUser} className="nav-user-icon"/> </a>
        </div>

        {/* Mobile menu */}
        <div className="nav-mobile-menu">
          {/* xem trạng thái button đang mở hay đóng */}
          <button
            className={`nav-mobile-button ${mobileOpen ? 'open' : 'close'}`}
            onClick={() => setMobileOpen(v => !v)}   
          >
            <h2>{mobileOpen ? 'Close' : 'Menu'}</h2> {/* Hiện chữ Menu khi đóng, ẩn khi mở */}
          </button>

          <div className={`nav-mobile-panel ${mobileOpen ? 'open' : ''} ${scrolled ? 'mobile-scrolled' : 'mobile-not-scrolled'}`}>
            <a href="#home" onClick={() => setMobileOpen(false)}>Home</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>Products</a>
            <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
            <a href="#profile" onClick={() => setMobileOpen(false)}>Profile
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;