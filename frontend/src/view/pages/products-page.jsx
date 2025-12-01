import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/product-card';
import productsData from '../data/products.json';
import './pages-style/products-page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSort, faTimes, faChevronDown, faChevronUp, faCheck } from '@fortawesome/free-solid-svg-icons';

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
  const [visibleProducts, setVisibleProducts] = useState([]);
  
  const location = useLocation();

  // Extract unique categories from data
  const categories = [...new Set(productsData.map(p => p.category).filter(Boolean))];
  
  // Status options
  const statusOptions = [
    { label: 'Sale', value: 'sale' },
    { label: 'New Arrivals', value: 'new' },
    { label: 'Featured', value: 'featured' },
    { label: 'Hot Deals', value: 'hot-deal' }
  ];

  // Price ranges
  const priceRanges = [
    { label: 'Under 500k', min: 0, max: 500000 },
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

  useEffect(() => {
    setProducts(productsData);
    setFilteredProducts(productsData);
    
    // Parse query params if any (e.g. from navbar dropdown)
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    const searchParam = params.get('search');
    
    if (categoryParam) {
      let filtered = productsData;
      filtered = filtered.filter(p => p.category && p.category.toLowerCase().includes(categoryParam.toLowerCase()));
      setFilteredProducts(filtered);
      setActiveFilters(prev => ({ ...prev, category: filtered.length > 0 ? filtered[0].category : null }));
    }

    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

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
        result = result.filter(p => p.isHotDeal);
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

    setFilteredProducts(result);
    
    // Reset và animate lại khi filter thay đổi
    setVisibleProducts([]);
    setIsLoading(true);
  }, [searchQuery, activeFilters, products]);

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
          <button className="shuffle-btn">
            <FontAwesomeIcon icon={faSort} />
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.length > 0 ? (
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
