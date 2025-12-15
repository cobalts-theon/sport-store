import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/view/pages/pages-style/home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import topo from '/src/assets/icon/topography.svg';
import api from '@/lib/api';

// Fallback images
import basketball from '/src/assets/image/basketball.png';
import football from '/src/assets/image/football(glitch).png';
import shoe from '/src/assets/image/shoe.png';
import volleyball from '/src/assets/image/volleyball(graffiti).png';
import waterbottle from '/src/assets/image/waterbottle(orange).png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Featured product IDs to show on home page
const FEATURED_PRODUCT_IDS = [5, 6, 7, 8, 9];

// Fallback data in case API fails
const fallbackImages = [basketball, football, shoe, volleyball, waterbottle];
const fallbackNames = [
  'PS C12 Basic Basketball',
  'PS GlitchX Football',
  'PS LXCX Trainer',
  'PS V675 Volleyball',
  'PS (O) Water Bottle'
];
const fallbackDescriptions = [
  '›››Elevate your game with the PS C12 Basic Basketball, designed for optimal performance and style on the court.',
  '›››Experience unmatched precision and control with the PS GlitchX Football, perfect for every pass and goal.',
  '›››Step into comfort and durability with the PS LXCX Trainer, your perfect companion for every workout.',
  '›››Dominate the court with the PS V675 Volleyball, crafted for power and agility.',
  '›››Stay hydrated in style with the PS (O) Water Bottle, featuring a sleek design and superior functionality.'
];

/**
 * Trang chủ của ứng dụng, hiển thị hình ảnh chuyển đổi và chuỗi vòng tròn.
 * Hiệu ứng chuyển đổi ảnh (Loop) mỗi 8 giây.
 */
function Home() {
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const ringText = " PRIME SOULS • PRIME SOULS • PRIME SOULS • ";

  // Fetch featured products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Filter products by featured IDs and sort by ID order
        const featuredProducts = FEATURED_PRODUCT_IDS
          .map(id => response.data.find(p => p.id === id))
          .filter(Boolean);
        
        if (featuredProducts.length > 0) {
          setProducts(featuredProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get current display data (from API or fallback)
  const images = products.length > 0 
    ? products.map(p => `${API_URL}${p.img}`)
    : fallbackImages;
  
  const productNames = products.length > 0
    ? products.map(p => p.name)
    : fallbackNames;
  
  const productDescriptions = products.length > 0
    ? products.map(p => `›››${p.description}`)
    : fallbackDescriptions;



  // Navigation handlers
  const goPrev = () => setCurrent((p) => (p - 1 + images.length) % images.length);
  const goNext = () => setCurrent((p) => (p + 1) % images.length);
  const goTo = (i) => setCurrent(i);

  const handleBuy = () => {
    const product = products[current];
    if (product) {
      navigate(`/product/${product.id}`);
    } else {
      // Fallback: use featured product IDs
      navigate(`/product/${FEATURED_PRODUCT_IDS[current]}`);
    }
  };

  const handleLearnMore = () => {
    const product = products[current];
    if (product) {
      navigate(`/product/${product.id}`);
    } else {
      navigate(`/product/${FEATURED_PRODUCT_IDS[current]}`);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 2100);

    return () => clearTimeout(timer);
  }, []);

  // Tự động chuyển ảnh mỗi 8 giây
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 8000); // 8000ms = 8s
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="home-container">
      <div className={`home-rectangle ${animateIn ? 'expand' : ''}`}>
        <div className="start-word">
            <h1 className="home-title">PRIME SOULS</h1>
            <h2 className="home-subtitle">Elevate your game with premium sportswear.</h2>
            <p className="scorll-text"><FontAwesomeIcon icon={faAngleDown} /> Scroll </p>
        </div>
        <svg className="ring-text" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <path id="text-circle" d="M100,10 a90,90 0 1,1 -0.01,0" />
          </defs>
          <text>
            <textPath xlinkHref="#text-circle" startOffset="0%">  
              {ringText.repeat(3)}
            </textPath>
          </text>
        </svg>
        
        <img src={topo} alt="" className="topo-background" aria-hidden="true" />
        
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
              alt={productNames[index] || `Slide ${index + 1}`}
              className={`slide ${index === current ? 'active' : ''}`}
              onError={(e) => {
                e.target.src = fallbackImages[index] || fallbackImages[0];
              }}
            />
          ))}

          <button className="carousel-btn prev" onClick={goPrev} aria-label="Previous slide">‹</button>
          <button className="carousel-btn next" onClick={goNext} aria-label="Next slide">›</button>

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
          <span className="product-id-tag">[Product ID: #{products[current]?.id || FEATURED_PRODUCT_IDS[current]}]</span>
          <span className="product-name-text">{productNames[current]}</span>
          <span className="product-description-text">{productDescriptions[current]}</span>
        </div>
        
        <div className="triangle-column">
          <div className="triangle">&#9650;</div>
          <div className="triangle">&#9650;</div>
          <div className="triangle">&#9650;</div>
          <div className="triangle">&#9650;</div>
          <div className="triangle">&#9650;</div>
        </div>
          <div className="product-actions">
            <button className="buy-btn" onClick={handleBuy} aria-label={`Buy ${productNames[current]}`}>
              <span className="btn-text">Buy now</span>
            </button>
            <button className="learn-btn" onClick={handleLearnMore} aria-label={`Learn more about ${productNames[current]}`}>
              <span className="btn-text">Learn more</span>
            </button>
          </div>
          <div className="product"></div>
      </div>
    </div>
  );
}

export default Home;