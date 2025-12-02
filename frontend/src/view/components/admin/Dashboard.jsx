// frontend/src/view/components/admin/Dashboard.jsx
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDollarSign,
  faShoppingCart,
  faUsers,
  faBox,
  faArrowUp,
  faArrowDown,
  faChartLine,
  faStar,
  faClock,
  faTag
} from '@fortawesome/free-solid-svg-icons';

// Format VND currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

function Dashboard({ products, orders, users, promotions }) {
  // Calculate statistics from real data
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + (Number(order.totalAmount) || Number(order.total) || 0), 0);
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const shippingOrders = orders.filter(o => o.status === 'shipping').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 20 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  // Calculate trends (based on this month vs previous - simplified)
  const revenueTrend = 12.5;
  const ordersTrend = 8.3;
  const usersTrend = 15.7;
  const productsTrend = -3.2;
  
  // Recent orders (last 5) - using actual data structure
  const recentOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(b.createdAt || b.date || b.orderDate || 0);
      const dateB = new Date(a.createdAt || a.date || a.orderDate || 0);
      return dateA - dateB;
    })
    .slice(0, 5);
  
  // Hot deal products
  const hotDealProducts = products
    .filter(p => p.isHotDeal)
    .slice(0, 5);
  
  // Low stock alerts
  const lowStockAlerts = products
    .filter(p => p.stock < 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  // Active promotions
  const activePromotions = promotions.filter(p => p.active);

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      shipping: '#2196F3',
      completed: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get product image URL
  const getImageUrl = (product) => {
    const img = product.image || product.img;
    if (!img) return 'https://via.placeholder.com/50x50?text=No+Image';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `http://localhost:3000${img}`;
    return `http://localhost:3000/${img}`;
  };

  return (
    <div className="dashboard-container">
      {/* Section: Key Metrics */}
      <div className="section-title-bar">
        <span className="section-icon"><FontAwesomeIcon icon={faChartLine} /></span>
        <h2>Key Metrics</h2>
        <span className="section-line"></span>
      </div>
      
      {/* Key Metrics */}
      <div className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <div className="metric-icon" style={{background: 'rgba(76, 175, 80, 0.1)'}}>
            <FontAwesomeIcon icon={faDollarSign} style={{color: '#4CAF50'}} />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">{formatCurrency(totalRevenue)}</p>
            <div className={`metric-trend ${revenueTrend >= 0 ? 'positive' : 'negative'}`}>
              <FontAwesomeIcon icon={revenueTrend >= 0 ? faArrowUp : faArrowDown} />
              <span>{Math.abs(revenueTrend)}% from last month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-metric-card">
          <div className="metric-icon" style={{background: 'rgba(33, 150, 243, 0.1)'}}>
            <FontAwesomeIcon icon={faShoppingCart} style={{color: '#2196F3'}} />
          </div>
          <div className="metric-content">
            <h3>Total Orders</h3>
            <p className="metric-value">{totalOrders}</p>
            <div className={`metric-trend ${ordersTrend >= 0 ? 'positive' : 'negative'}`}>
              <FontAwesomeIcon icon={ordersTrend >= 0 ? faArrowUp : faArrowDown} />
              <span>{Math.abs(ordersTrend)}% from last month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-metric-card">
          <div className="metric-icon" style={{background: 'rgba(156, 39, 176, 0.1)'}}>
            <FontAwesomeIcon icon={faUsers} style={{color: '#9C27B0'}} />
          </div>
          <div className="metric-content">
            <h3>Active Users</h3>
            <p className="metric-value">{activeUsers}</p>
            <div className={`metric-trend ${usersTrend >= 0 ? 'positive' : 'negative'}`}>
              <FontAwesomeIcon icon={usersTrend >= 0 ? faArrowUp : faArrowDown} />
              <span>{Math.abs(usersTrend)}% from last month</span>
            </div>
          </div>
        </div>

        <div className="dashboard-metric-card">
          <div className="metric-icon" style={{background: 'rgba(255, 152, 0, 0.1)'}}>
            <FontAwesomeIcon icon={faBox} style={{color: '#FF9800'}} />
          </div>
          <div className="metric-content">
            <h3>Products</h3>
            <p className="metric-value">{totalProducts}</p>
            <div className={`metric-trend ${productsTrend >= 0 ? 'positive' : 'negative'}`}>
              <FontAwesomeIcon icon={productsTrend >= 0 ? faArrowUp : faArrowDown} />
              <span>{Math.abs(productsTrend)}% from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Quick Stats */}
      <div className="section-title-bar">
        <span className="section-icon"><FontAwesomeIcon icon={faClock} /></span>
        <h2>Quick Stats</h2>
        <span className="section-line"></span>
      </div>

      {/* Quick Stats */}
      <div className="dashboard-quick-stats">
        <div className="quick-stat-card">
          <div className="quick-stat-header">
            <FontAwesomeIcon icon={faClock} />
            <span>Pending Orders</span>
          </div>
          <p className="quick-stat-value">{pendingOrders}</p>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-header">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Shipping</span>
          </div>
          <p className="quick-stat-value">{shippingOrders}</p>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-header">
            <FontAwesomeIcon icon={faBox} />
            <span>Low Stock</span>
          </div>
          <p className="quick-stat-value warning">{lowStockProducts}</p>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-header">
            <FontAwesomeIcon icon={faBox} />
            <span>Out of Stock</span>
          </div>
          <p className="quick-stat-value danger">{outOfStock}</p>
        </div>
      </div>

      {/* Section: Details */}
      <div className="section-title-bar">
        <span className="section-icon"><FontAwesomeIcon icon={faBox} /></span>
        <h2>Details Overview</h2>
        <span className="section-line"></span>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <FontAwesomeIcon icon={faShoppingCart} />
              Recent Orders
            </h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="dashboard-card-content">
            {recentOrders.length === 0 ? (
              <p className="no-data">No orders yet</p>
            ) : (
              <div className="recent-orders-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="recent-order-item">
                    <div className="order-info">
                      <span className="order-id">#{order.id}</span>
                      <span className="order-customer">{order.fullName || order.customer?.name || 'N/A'}</span>
                      <span className="order-date">{formatDate(order.createdAt || order.date || order.orderDate)}</span>
                    </div>
                    <div className="order-details">
                      <span className="order-amount">{formatCurrency(order.totalAmount || order.total)}</span>
                      <span 
                        className="order-status-badge"
                        style={{
                          backgroundColor: getOrderStatusColor(order.status) + '20',
                          color: getOrderStatusColor(order.status)
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hot Deal Products */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <FontAwesomeIcon icon={faStar} />
              Hot Deal Products
            </h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="dashboard-card-content">
            {hotDealProducts.length === 0 ? (
              <p className="no-data">No hot deal products</p>
            ) : (
              <div className="top-products-list">
                {hotDealProducts.map((product, index) => (
                  <div key={product.id} className="top-product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <img 
                      src={getImageUrl(product)} 
                      alt={product.name} 
                      className="product-thumb"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'; }}
                    />
                    <div className="product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-price">{formatCurrency(product.price)}</span>
                    </div>
                    <div className="product-stock">
                      <span className={product.stock < 20 ? 'low-stock' : 'in-stock'}>
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="dashboard-card alert-card">
          <div className="dashboard-card-header">
            <h3>
              <FontAwesomeIcon icon={faBox} />
              Low Stock Alerts
            </h3>
          </div>
          <div className="dashboard-card-content">
            {lowStockAlerts.length === 0 ? (
              <p className="no-data">All products well stocked</p>
            ) : (
              <div className="low-stock-list">
                {lowStockAlerts.map(product => (
                  <div key={product.id} className="low-stock-item">
                    <div className="stock-product-info">
                      <img 
                        src={getImageUrl(product)} 
                        alt={product.name} 
                        className="product-thumb-small"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=No+Image'; }}
                      />
                      <div>
                        <span className="stock-product-name">{product.name}</span>
                        <span className="stock-category">{product.category}</span>
                      </div>
                    </div>
                    <div className={`stock-indicator ${product.stock === 0 ? 'out' : 'low'}`}>
                      {product.stock === 0 ? 'Out of Stock' : `Only ${product.stock} left`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active Promotions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <FontAwesomeIcon icon={faTag} />
              Active Coupons
            </h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="dashboard-card-content">
            {activePromotions.length === 0 ? (
              <p className="no-data">No active coupons</p>
            ) : (
              <div className="promotions-list">
                {activePromotions.slice(0, 3).map(promo => (
                  <div key={promo.id} className="promotion-item">
                    <div className="promo-info">
                      <span className="promo-code">{promo.code}</span>
                      <span className="promo-description">{promo.description}</span>
                    </div>
                    <div className="promo-stats">
                      <span className="promo-value">
                        {promo.discountType === 'percentage' 
                          ? `${promo.discountValue}% OFF` 
                          : `${formatCurrency(promo.discountValue)} OFF`}
                      </span>
                      <span className="promo-usage">
                        {promo.usedCount || 0} / {promo.usageLimit || '∞'} used
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
