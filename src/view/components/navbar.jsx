import React, { useState, useEffect } from "react";
import pswhitelogo from "/src/assets/image/white-logo.png";
import "./css/navbar.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  //
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
      </div>
    </nav>
  );
}

export default Navbar;