import React from 'react';
import "./components-style/infbar.css";
import blacklogo from "/src/assets/image/black-logo.png";

function Infbar() {
  // Tăng số lượng logo để đảm bảo không bao giờ bị thiếu
  const logos = Array(30).fill(null); 

  return (
    <div className="infbar-container">
      <div className="infbar-track">
        {/* Dãy logo 1 */}
        {logos.map((_, index) => (
          <img 
            key={`logo-a-${index}`} /* Key duy nhất */
            src={blacklogo} 
            alt="Scrolling Logo" 
            className="infbar-logo" 
          />
        ))}
        {/* Dãy logo 2 (bản sao để lặp lại) */}
        {logos.map((_, index) => (
          <img 
            key={`logo-b-${index}`} /* Key duy nhất */
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