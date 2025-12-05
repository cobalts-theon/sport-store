import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/product-card';
import api from '../../lib/api';
import './pages-style/products-page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faTimes, faChevronDown, faChevronUp, faCheck, faSpinner, faAngleUp, faAngleDown, faClock } from '@fortawesome/free-solid-svg-icons';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    category: true,
    price: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [sortOption, setSortOption] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortMenuRef = useRef(null);
  
  const location = useLocation();

  // Extract unique categories from fetched products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  // Status options
  const statusOptions = [
    { label: 'Sale', value: 'sale' },
    { label: 'New Arrivals', value: 'new' },
    { label: 'Featured', value: 'featured' },
    { label: 'Hot Deals', value: 'hot-deal' }
  ];

  // Price ranges
  const priceRanges = [
    { label: 'Under 100k', min: 0, max: 100000 },
    { label: '100k - 500k', min: 100000, max: 500000 },
    { label: '500k - 1M', min: 500000, max: 1000000 },
    { label: 'Over 1M', min: 1000000, max: Infinity }
  ];

  // Mock Sizes
  const sizes = ['38', '39', '40', '41', '42', '43', 'S', 'M', 'L', 'XL'];

  // Mock Colors
  const colors = [
    { name: 'Black', code: '#000000' },
    { name: 'White', code: '#ffffff' },
    { name: 'Red', code: '#ff0000' },
    { name: 'Blue', code: '#0000ff' },
    { name: 'Orange', code: '#ffa500' },
    { name: 'Green', code: '#008000' },
    { name: 'Purple', code: '#800080' }
  ];

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsFetching(true);
      try {
        const res = await api.get('/products');
        // Map API response to match frontend format
        const mappedProducts = res.data.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.original_price,
          img: p.img_url ? (p.img_url.startsWith('http') ? p.img_url : `http://localhost:3000${p.img_url}`) : '/placeholder.jpg',
          hover: p.hover ? (p.hover.startsWith('http') ? p.hover : `http://localhost:3000${p.hover}`) : null,
          link: p.link || `/product/${p.id}`,
          tag: p.tag,
          category: p.category,
          material: p.material,
          brand: p.brand,
          isHotDeal: p.isHotDeal,
          stock: p.stock
        }));
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProducts();
  }, []);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Parse query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    const statusParam = params.get('status');
    const priceParam = params.get('price');
    
    // Lọc theo category từ URL params
    if (categoryParam && products.length > 0) {
      let filtered = products;
      filtered = filtered.filter(p => p.category && p.category.toLowerCase().includes(categoryParam.toLowerCase()));
      setFilteredProducts(filtered);
      setActiveFilters(prev => ({ ...prev, category: filtered.length > 0 ? filtered[0].category : null }));
    }

    //Đặt filter từ URL params
    if (statusParam && products.length > 0) {
      setActiveFilters(prev => ({ ...prev, status: statusParam }));
    }

    if (priceParam && products.length > 0) {
      const priceMap = {
        'under100k': 'Under 100k',
        '100k-500k': '100k - 500k',
        '500k-1m': '500k - 1M',
        'over1m': 'Over 1M'
      };
      if (priceMap[priceParam]) {
        setActiveFilters(prev => ({ ...prev, priceRange: priceMap[priceParam] }));
      }
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search, products]);

  useEffect(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (activeFilters.status) {
      if (activeFilters.status === 'hot-deal') {
        // Match logic with product-card: isHotDeal OR discount >= 20%
        result = result.filter(p => {
          const discountPercentage = p.originalPrice && p.price 
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 0;
          return p.isHotDeal === true || discountPercentage >= 20;
        });
      } else {
        result = result.filter(p => p.tag === activeFilters.status);
      }
    }

    // Category filter
    if (activeFilters.category) {
      result = result.filter(p => p.category === activeFilters.category);
    }

    // Price filter
    if (activeFilters.priceRange) {
      const range = priceRanges.find(r => r.label === activeFilters.priceRange);
      if (range) {
        result = result.filter(p => {
          const price = p.price || 0;
          return price >= range.min && price <= range.max;
        });
      }
    }

    // Size filter (Mock)
    if (activeFilters.size) {
      // In a real app, products would have a sizes array. 
      // Here we just show the UI works, potentially filtering randomly or not at all for now
      // or we can assume all products have all sizes for this demo
    }

    // Color filter (Mock)
    if (activeFilters.color) {
      // Same as size, mock logic or partial match if description contains color
      result = result.filter(p => 
        p.description.toLowerCase().includes(activeFilters.color.toLowerCase()) ||
        p.name.toLowerCase().includes(activeFilters.color.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
      default:
        result = [...result].sort((a, b) => (b.id || 0) - (a.id || 0));
        break;
    }

    setFilteredProducts(result);
    
    // Reset và animate lại khi filter thay đổi
    setVisibleProducts([]);
    setIsLoading(true);
  }, [searchQuery, activeFilters, products, sortOption]);

  // Stagger animation effect
  useEffect(() => {
    if (filteredProducts.length > 0 && isLoading) {
      setVisibleProducts([]);
      
      // Animate từng product với delay
      filteredProducts.forEach((product, index) => {
        setTimeout(() => {
          setVisibleProducts(prev => [...prev, product.id]);
          
          // Kết thúc loading sau khi tất cả products đã hiện
          if (index === filteredProducts.length - 1) {
            setTimeout(() => setIsLoading(false), 100);
          }
        }, index * 80); // 80ms delay giữa mỗi product
      });
    }
  }, [filteredProducts, isLoading]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (type, value) => {
    setActiveFilters(prev => {
      if (prev[type] === value) {
        const newFilters = { ...prev };
        delete newFilters[type];
        return newFilters;
      }
      return { ...prev, [type]: value };
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSort = (option) => {
    setSortOption(option);
    setShowSortMenu(false);
  };

  const getSortLabel = () => {
    switch (sortOption) {
      case 'price-asc': return 'Price: Low to High';
      case 'price-desc': return 'Price: High to Low';
      case 'newest': return 'Newest';
      default: return 'Sort';
    }
  };

  const getSortIcon = () => {
    switch (sortOption) {
      case 'price-asc': return faAngleUp;
      case 'price-desc': return faAngleDown;
      case 'newest': return faClock;
      default: return faSort;
    }
  };

  return (
    <div className="products-page">
      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside className={`products-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>FILTERS</h2>
          <div className="sidebar-actions">
            {(Object.keys(activeFilters).length > 0 || searchQuery) && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            )}
            <button className="close-sidebar-btn" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="search-box">
          <FontAwesomeIcon icon={faSearch} className="products-search-icon" />
          <input 
            type="text" 
            placeholder="SEARCH BY NAME..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-sections">
          
          {/* Status Section */}
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('status')}
            >
              <span>STATUS</span>
              <FontAwesomeIcon icon={expandedSections.status ? faChevronUp : faChevronDown} />
            </div>
            {expandedSections.status && (
              <div className="filter-options">
                {statusOptions.map(option => (
                  <div 
                    key={option.value} 
                    className={`filter-option ${activeFilters.status === option.value ? 'active' : ''}`}
                    onClick={() => handleFilterChange('status', option.value)}
                  >
                    {option.label.toUpperCase()}
                    {activeFilters.status === option.value && <FontAwesomeIcon icon={faTimes} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Section */}
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('category')}
            >
              <span>CATEGORY</span>
              <FontAwesomeIcon icon={expandedSections.category ? faChevronUp : faChevronDown} />
            </div>
            {expandedSections.category && (
              <div className="filter-options">
                {categories.map(cat => (
                  <div 
                    key={cat} 
                    className={`filter-option ${activeFilters.category === cat ? 'active' : ''}`}
                    onClick={() => handleFilterChange('category', cat)}
                  >
                    {cat.toUpperCase()}
                    {activeFilters.category === cat && <FontAwesomeIcon icon={faTimes} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="filter-section">
            <div 
              className="filter-section-header" 
              onClick={() => toggleSection('price')}
            >
              <span>PRICE</span>
              <FontAwesomeIcon icon={expandedSections.price ? faChevronUp : faChevronDown} />
            </div>
            {expandedSections.price && (
              <div className="filter-options">
                {priceRanges.map(range => (
                  <div 
                    key={range.label} 
                    className={`filter-option ${activeFilters.priceRange === range.label ? 'active' : ''}`}
                    onClick={() => handleFilterChange('priceRange', range.label)}
                  >
                    {range.label}
                    {activeFilters.priceRange === range.label && <FontAwesomeIcon icon={faTimes} />}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="products-main">
        <div className="products-header">
          <button className="filter-toggle-btn" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faFilter} />
            <span>FILTERS</span>
            {Object.keys(activeFilters).length > 0 && (
              <span className="filter-badge">{Object.keys(activeFilters).length}</span>
            )}
          </button>
          <span className="products-count">{filteredProducts.length} PRODUCTS</span>
          <div className="sort-container" ref={sortMenuRef}>
            <button 
              className={`shuffle-btn ${showSortMenu ? 'active' : ''}`}
              onClick={() => setShowSortMenu(!showSortMenu)}
            >
              <FontAwesomeIcon icon={getSortIcon()} />
            </button>
            {showSortMenu && (
              <div className="sort-menu">
                <div 
                  className={`sort-option ${sortOption === 'newest' ? 'active' : ''}`}
                  onClick={() => handleSort('newest')}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span>Newest</span>
                  {sortOption === 'newest' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
                </div>
                <div 
                  className={`sort-option ${sortOption === 'price-asc' ? 'active' : ''}`}
                  onClick={() => handleSort('price-asc')}
                >
                  <FontAwesomeIcon icon={faAngleUp} />
                  <span>Price: Low to High</span>
                  {sortOption === 'price-asc' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
                </div>
                <div 
                  className={`sort-option ${sortOption === 'price-desc' ? 'active' : ''}`}
                  onClick={() => handleSort('price-desc')}
                >
                  <FontAwesomeIcon icon={faAngleDown} />
                  <span>Price: High to Low</span>
                  {sortOption === 'price-desc' && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="products-grid">
          {isFetching ? (
            <div className="products-loading">
              <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`product-card-wrapper ${visibleProducts.includes(product.id) ? 'visible' : ''}`}
                style={{ '--animation-order': index }}
              >
                <ProductCard product={product} index={index} />
              </div>
            ))
          ) : (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProductsPage;
