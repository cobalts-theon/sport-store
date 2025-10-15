import { useState, useEffect } from 'react';
import '/src/view/pages/pages-style/home.css';
import basketball from '/src/assets/image/basketball.png';
import football from '/src/assets/image/football(glitch).png';
import shoe from '/src/assets/image/shoe.png';
import volleyball from '/src/assets/image/volleyball(graffiti).png';
import waterbottle from '/src/assets/image/waterbottle(orange).png';

/**
 * Trang chủ của ứng dụng, hiển thị hình ảnh chuyển đổi và chuỗi vòng tròn.
 * Hiệu ứng chuyển đổi ảnh (Loop) mỗi 3 giây.
 * Hiệu ứng chờ 2 giây để load trang chủ sau khi start-intro kết thúc.
 */
function Home() {
  const [animateIn, setAnimateIn] = useState(false);
  const [current, setCurrent] = useState(0);
  const ringText = " PRIME SOULS • PRIME SOULS • PRIME SOULS • ";
  const images = [basketball, football, shoe, volleyball, waterbottle];
  const productNames = [
    'PS C12 Basic Basketball',
    'PS GlitchX Football',
    'PS LXCX Trainer',
    'PS V675 Volleyball',
    'PS (O) Water Bottle'
  ];

  const ProductDescriptions = [
    '›››Elevate your game with the PS C12 Basic Basketball, designed for optimal performance and style on the court, whether you\'re a beginner or a pro.',
    '›››Experience unmatched precision and control with the PS GlitchX Football, perfect for every pass and goal, rain or shine, on any field.',
    '›››Step into comfort and durability with the PS LXCX Trainer, your perfect companion for every workout, run, or casual outing, combining style and performance.',
    '›››Dominate the court with the PS V675 Volleyball, crafted for power and agility, ensuring every spike and serve is executed with excellence.',
    '›››Stay hydrated in style with the PS (O) Water Bottle, featuring a sleek design and superior functionality, perfect for athletes and everyday use.'
  ];

  // add simple navigation handlers
  const goPrev = () => setCurrent((p) => (p - 1 + images.length) % images.length);
  const goNext = () => setCurrent((p) => (p + 1) % images.length);
  const goTo = (i) => setCurrent(i);

  const handleBuy = () => {
    // replace with real purchase flow
    alert(`Buy now: ${productNames[current]}`);
  };

  useEffect(() => {
    // Delay để chờ start-intro kết thúc (2000ms từ App.jsx)
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 2100); // slightly after StartupLoader duration

    return () => clearTimeout(timer);
  }, []);

  // Hiệu ứng chuyển đổi ảnh (Loop)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 8000); // đổi ảnh mỗi 3 giây
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="home-container">
      <div className={`home-rectangle ${animateIn ? 'expand' : ''}`}>
        <div className="start-word">
            <h1 className="home-title">PRIME SOULS</h1>
            <h2 className="home-subtitle">Elevate your game with premium sportswear.</h2>
        </div>
        <svg className="ring-text" viewBox="0 0 200 200" aria-hidden="true"> {/* Vòng tròn văn bản trang trí */}
          <defs>
            <path id="text-circle" d="M100,10 a90,90 0 1,1 -0.01,0" />
          </defs>
          <text>
            <textPath xlinkHref="#text-circle" startOffset="0%">  
              {ringText.repeat(3)}  {/* repeat(3) Lặp lại chuỗi văn bản 3 để tạo hiệu ứng vòng tròn */}
            </textPath>
          </text>
        </svg>
        <div
          className="image-Carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Product images"
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`slide ${index === current ? 'active' : ''}`}
            />
          ))}

          {/* scroll buttons */}
          <button className="carousel-btn prev" onClick={goPrev} aria-label="Previous slide">‹</button>
          <button className="carousel-btn next" onClick={goNext} aria-label="Next slide">›</button>

          {/* dots */}
          <div className="carousel-dots" role="tablist" aria-label="Slides">
            {images.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === current ? 'active' : ''}`}  
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === current}
                role="tab"
              />
            ))}
          </div>
        </div>

        <div className="home-shape"></div>
        <div className="product-name">
          <span className="product-name-text">{productNames[current]}</span>
          <span className="product-description-text">{ProductDescriptions[current]}</span>
        </div>
          <div className="product-actions">
            <button className="buy-btn" onClick={handleBuy} aria-label={`Buy ${productNames[current]}`}>
              <span className="btn-text">Buy now</span>
            </button>
            <button className="learn-btn" aria-label={`Learn more about ${productNames[current]}`}>
              <span className="btn-text">Learn more</span>
            </button>
          </div>
          <div className="product"></div>
      </div>
    </div>
  );
}

export default Home;