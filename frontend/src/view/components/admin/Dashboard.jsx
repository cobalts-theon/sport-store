// frontend/src/view/components/admin/Dashboard.jsx
// Dashboard.jsx hiển thị bảng điều khiển tổng quan với các chỉ số chính và các phần khác nhau cho trang quản trị
//Liên quan đến frontend/src/view/components/admin/AdminHeader.jsx
//Liên quan đến frontend/src/view/components/admin/AdminSidebar.jsx
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
  faClock
} from '@fortawesome/free-solid-svg-icons';

function Dashboard({ products, orders, users, promotions }) {
  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  
  const activeUsers = users.filter(u => u.status === 'active').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 20 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  // Calculate trends (mock percentage changes)
  const revenueTrend = 12.5;
  const ordersTrend = 8.3;
  const usersTrend = 15.7;
  const productsTrend = -3.2;
  
  // Recent orders (last 5)
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 5);
  
  // Top selling products (mock data based on featured)
  const topProducts = products
    .filter(p => p.featured)
    .slice(0, 5);
  
  // Low stock alerts
  const lowStockAlerts = products
    .filter(p => p.stock < 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5);

  const getOrderStatusColor = (status) => {
    const colors = {
      pending: '#FF9800',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336'
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Key Metrics */}
      <div className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <div className="metric-icon" style={{background: 'rgba(76, 175, 80, 0.1)'}}>
            <FontAwesomeIcon icon={faDollarSign} style={{color: '#4CAF50'}} />
          </div>
          <div className="metric-content">
            <h3>Total Revenue</h3>
            <p className="metric-value">${totalRevenue.toFixed(2)}</p>
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
            <FontAwesomeIcon icon={faBox} />
            <span>Low Stock Items</span>
          </div>
          <p className="quick-stat-value warning">{lowStockProducts}</p>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-header">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Completed Orders</span>
          </div>
          <p className="quick-stat-value">{completedOrders}</p>
        </div>
        
        <div className="quick-stat-card">
          <div className="quick-stat-header">
            <FontAwesomeIcon icon={faBox} />
            <span>Out of Stock</span>
          </div>
          <p className="quick-stat-value danger">{outOfStock}</p>
        </div>
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
              <p className="no-data">No recent orders</p>
            ) : (
              <div className="recent-orders-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="recent-order-item">
                    <div className="order-info">
                      <span className="order-id">#{order.id}</span>
                      <span className="order-customer">{order.customerName}</span>
                      <span className="order-date">{formatDate(order.orderDate)}</span>
                    </div>
                    <div className="order-details">
                      <span className="order-amount">${order.total.toFixed(2)}</span>
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

        {/* Top Products */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <FontAwesomeIcon icon={faStar} />
              Featured Products
            </h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="dashboard-card-content">
            {topProducts.length === 0 ? (
              <p className="no-data">No featured products</p>
            ) : (
              <div className="top-products-list">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="top-product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <img src={product.image} alt={product.name} className="product-thumb" />
                    <div className="product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="product-stock">
                      <span className={product.stock < 20 ? 'low-stock' : 'in-stock'}>
                        {product.stock} units
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
                      <img src={product.image} alt={product.name} className="product-thumb-small" />
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
              <FontAwesomeIcon icon={faChartLine} />
              Active Promotions
            </h3>
            <a href="#" className="view-all-link">View All</a>
          </div>
          <div className="dashboard-card-content">
            {promotions.filter(p => p.active).length === 0 ? (
              <p className="no-data">No active promotions</p>
            ) : (
              <div className="promotions-list">
                {promotions.filter(p => p.active).slice(0, 3).map(promo => (
                  <div key={promo.id} className="promotion-item">
                    <div className="promo-info">
                      <span className="promo-code">{promo.code}</span>
                      <span className="promo-description">{promo.description}</span>
                    </div>
                    <div className="promo-stats">
                      <span className="promo-value">
                        {promo.discountType === 'percentage' 
                          ? `${promo.discountValue}% OFF` 
                          : `$${promo.discountValue} OFF`}
                      </span>
                      <span className="promo-usage">
                        {promo.usedCount} / {promo.usageLimit || '∞'} used
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
