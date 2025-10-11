import React from 'react';
import "./components-style/infbar.css";
import blacklogo from "/src/assets/image/black-logo.png";

function Infbar() {
  // Tạo một mảng để lặp và hiển thị logo
  const logos = Array(20).fill(null); 

  return (
    <div className="infbar-container">
      <div className="infbar-track">
        {/* Hiển thị bộ logo đầu tiên */}
        {logos.map((_, index) => (
          <img 
            key={index} 
            src={blacklogo} 
            alt="Scrolling Logo" 
            className="infbar-logo" 
          />
        ))}
        {/* Hiển thị bộ logo thứ hai để tạo vòng lặp liền mạch */}
        {logos.map((_, index) => (
          <img 
            key={index + logos.length} 
            src={blacklogo} 
            alt="Scrolling Logo" 
            className="infbar-logo" 
          />
        ))}
      </div>
    </div>
  );
}

export default Infbar;