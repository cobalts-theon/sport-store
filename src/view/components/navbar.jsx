import React, { useState, useEffect } from "react";
import pswhitelogo from "/src/assets/image/white-logo.png";
import "./components-style/navbar.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={scrolled ? 'nav scrolled' : 'nav'}>
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
          <button
            className={`nav-mobile-button ${mobileOpen ? 'open' : 'close'}`}
            onClick={() => setMobileOpen(v => !v)}
          >
            <h2 className="open-menu">{mobileOpen ? '' : 'Menu'}</h2>
            <h2 className="close-menu">{mobileOpen ? 'Close' : ''}</h2>
          </button>

          <div className={`nav-mobile-panel ${mobileOpen ? 'open' : ''}`}>
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