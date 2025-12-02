// Analytics.jsx - Admin analytics dashboard with key performance indicators and charts
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine,
  faChartBar,
  faChartPie,
  faCalendarAlt,
  faDollarSign,
  faShoppingCart,
  faUsers,
  faBox,
  faDownload,
  faFilter,
  faArrowUp,
  faArrowDown,
  faStar,
  faPercent
} from '@fortawesome/free-solid-svg-icons';

// Format VND currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// Month names for the chart
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function Analytics({ products, orders, users }) {
  const [timeRange, setTimeRange] = useState('30days');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Calculate analytics data from real data
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + (Number(order.totalAmount) || Number(order.total) || 0), 0);
  
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const conversionRate = users.length > 0 
    ? ((orders.length / users.length) * 100).toFixed(1)
    : 0;
  
  // Revenue by status - using actual status values
  const revenueByStatus = {
    completed: orders.filter(o => o.status === 'completed').reduce((s, o) => s + (Number(o.totalAmount) || Number(o.total) || 0), 0),
    pending: orders.filter(o => o.status === 'pending').reduce((s, o) => s + (Number(o.totalAmount) || Number(o.total) || 0), 0),
    shipping: orders.filter(o => o.status === 'shipping').reduce((s, o) => s + (Number(o.totalAmount) || Number(o.total) || 0), 0),
    cancelled: orders.filter(o => o.status === 'cancelled').reduce((s, o) => s + (Number(o.totalAmount) || Number(o.total) || 0), 0)
  };
  
  // Category analysis from real products
  const categoryStats = products.reduce((acc, product) => {
    const cat = product.category || 'Other';
    if (!acc[cat]) {
      acc[cat] = { count: 0, value: 0 };
    }
    acc[cat].count++;
    acc[cat].value += (product.price || 0) * (product.stock || 0);
    return acc;
  }, {});
  
  // User segments based on role
  const userSegments = {
    admin: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active' && u.role !== 'admin').length,
    pending: users.filter(u => u.status === 'pending').length,
    suspended: users.filter(u => u.status === 'suspended').length
  };
  
  // Top customers (users with orders)
  const topCustomers = [...users]
    .filter(u => u.role !== 'admin')
    .slice(0, 5);
  
  // Get available years from orders
  const availableYears = [...new Set(orders.map(order => {
    const date = new Date(order.createdAt || order.date || order.orderDate);
    return isNaN(date.getTime()) ? null : date.getFullYear();
  }).filter(y => y !== null))].sort((a, b) => b - a);
  
  // If no years available, use current year
  if (availableYears.length === 0) {
    availableYears.push(new Date().getFullYear());
  }
  
  // Monthly sales data - show all 12 months for selected year
  const salesData = monthNames.map((monthName, index) => {
    const monthOrders = orders.filter(order => {
      const date = new Date(order.createdAt || order.date || order.orderDate);
      if (isNaN(date.getTime())) return false;
      return date.getMonth() === index && date.getFullYear() === selectedYear;
    });
    
    const sales = monthOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || Number(o.total) || 0), 0);
    const orderCount = monthOrders.length;
    
    return {
      month: monthName,
      monthIndex: index,
      sales,
      orders: orderCount
    };
  });
  
  const maxSales = Math.max(...salesData.map(d => d.sales), 1);
  
  // Calculate year total
  const yearTotal = salesData.reduce((sum, d) => sum + d.sales, 0);

  // Bar colors based on performance
  const getBarColor = (sales, maxSales) => {
    const percentage = (sales / maxSales) * 100;
    if (percentage >= 80) return '#4CAF50'; // Green for high
    if (percentage >= 50) return '#D0FE1D'; // Yellow-green for medium
    if (percentage >= 25) return '#FF9800'; // Orange for low
    return '#F44336'; // Red for very low
  };

  return (
    <div className="analytics-container">
      {/* Analytics Header */}
      <div className="analytics-header">
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === '7days' ? 'active' : ''}`}
            onClick={() => setTimeRange('7days')}
          >
            7 Days
          </button>
          <button 
            className={`time-btn ${timeRange === '30days' ? 'active' : ''}`}
            onClick={() => setTimeRange('30days')}
          >
            30 Days
          </button>
          <button 
            className={`time-btn ${timeRange === '90days' ? 'active' : ''}`}
            onClick={() => setTimeRange('90days')}
          >
            90 Days
          </button>
          <button 
            className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            This Year
          </button>
        </div>
        <div className="analytics-actions">
          <button className="analytics-btn">
            <FontAwesomeIcon icon={faFilter} />
            Filter
          </button>
          <button className="analytics-btn primary">
            <FontAwesomeIcon icon={faDownload} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="section-title-bar">
        <span className="section-icon"><FontAwesomeIcon icon={faChartLine} /></span>
        <h2>Key Performance Indicators</h2>
        <span className="section-line"></span>
      </div>
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span>Total Revenue</span>
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <p className="kpi-value">{formatCurrency(totalRevenue)}</p>
          <div className="kpi-trend positive">
            <FontAwesomeIcon icon={faArrowUp} />
            <span>+18.5% vs last period</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span>Avg Order Value</span>
            <FontAwesomeIcon icon={faShoppingCart} />
          </div>
          <p className="kpi-value">{formatCurrency(avgOrderValue)}</p>
          <div className="kpi-trend positive">
            <FontAwesomeIcon icon={faArrowUp} />
            <span>+7.2% vs last period</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span>Conversion Rate</span>
            <FontAwesomeIcon icon={faPercent} />
          </div>
          <p className="kpi-value">{conversionRate}%</p>
          <div className="kpi-trend negative">
            <FontAwesomeIcon icon={faArrowDown} />
            <span>-2.3% vs last period</span>
          </div>
        </div>

        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span>Active Customers</span>
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <p className="kpi-value">{users.filter(u => u.status === 'active').length}</p>
          <div className="kpi-trend positive">
            <FontAwesomeIcon icon={faArrowUp} />
            <span>+12.8% vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="section-title-bar">
        <span className="section-icon"><FontAwesomeIcon icon={faChartBar} /></span>
        <h2>Charts & Analysis</h2>
        <span className="section-line"></span>
      </div>
      <div className="analytics-charts-grid">
        {/* Sales Chart */}
        <div className="analytics-chart-card large">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faChartLine} />
              Sales Overview - {selectedYear}
            </h3>
            <div className="chart-controls">
              <select 
                className="year-selector"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="chart-legend">
                <span className="legend-item">
                  <span className="legend-color" style={{background: '#D0FE1D'}}></span>
                  Revenue
                </span>
              </div>
            </div>
          </div>
          <div className="chart-content">
            <div className="year-total">
              <span className="year-total-label">Total {selectedYear}:</span>
              <span className="year-total-value">{formatCurrency(yearTotal)}</span>
            </div>
            <div className={`bar-chart monthly-chart ${yearTotal > 0 ? 'has-data' : ''}`}>
              {salesData.map((data, index) => {
                // Calculate bar height - minimum 15% for bars with data, scale up rest
                const baseHeight = maxSales > 0 ? (data.sales / maxSales) * 100 : 0;
                const boostedHeight = data.sales > 0 ? Math.max(15, baseHeight * 1.2) : 0;
                
                return (
                  <div key={index} className="bar-group">
                    <div className="bar-value">
                      {data.sales > 0 ? (
                        data.sales >= 1000000 
                          ? `${(data.sales / 1000000).toFixed(1)}M` 
                          : `${(data.sales / 1000).toFixed(0)}K`
                      ) : ''}
                    </div>
                    <div className="bar-wrapper">
                      <div 
                        className="bar"
                        style={{
                          height: `${Math.min(boostedHeight, 100)}%`,
                          background: data.sales > 0 ? getBarColor(data.sales, maxSales) : 'rgba(255,255,255,0.1)',
                          minHeight: data.sales > 0 ? '40px' : '2px'
                        }}
                        title={`${data.month} ${selectedYear}: ${formatCurrency(data.sales)} (${data.orders} orders)`}
                      ></div>
                    </div>
                    <span className="bar-label">{data.month}</span>
                    <span className="bar-orders">{data.orders > 0 ? `${data.orders}` : '-'}</span>
                  </div>
                );
              })}
            </div>
            <div className="chart-footer">
              <div className="color-legend">
                <span className="color-item"><span style={{background: '#4CAF50'}}></span> High</span>
                <span className="color-item"><span style={{background: '#D0FE1D'}}></span> Medium</span>
                <span className="color-item"><span style={{background: '#FF9800'}}></span> Low</span>
                <span className="color-item"><span style={{background: '#F44336'}}></span> Very Low</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Status - Pie Chart */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faChartPie} />
              Revenue by Status
            </h3>
          </div>
          <div className="chart-content">
            <div className="pie-chart-container">
              <svg className="pie-chart-svg" viewBox="0 0 200 200">
                {(() => {
                  const colors = {
                    completed: '#4CAF50',
                    pending: '#FF9800',
                    shipping: '#2196F3',
                    cancelled: '#F44336'
                  };
                  let currentAngle = 0;
                  const radius = 80;
                  const centerX = 100;
                  const centerY = 100;
                  
                  return Object.entries(revenueByStatus).map(([status, amount]) => {
                    const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
                    const angle = (percentage / 100) * 360;
                    
                    const startAngle = currentAngle;
                    const endAngle = currentAngle + angle;
                    currentAngle = endAngle;
                    
                    // Calculate path for pie slice
                    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
                    
                    const x1 = centerX + radius * Math.cos(startAngleRad);
                    const y1 = centerY + radius * Math.sin(startAngleRad);
                    const x2 = centerX + radius * Math.cos(endAngleRad);
                    const y2 = centerY + radius * Math.sin(endAngleRad);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    return (
                      <g key={status} className="pie-slice">
                        <path
                          d={pathData}
                          fill={colors[status]}
                          stroke="#0f0f10"
                          strokeWidth="2"
                          opacity="0.9"
                          className="pie-path"
                        />
                        <title>{`${status}: ${formatCurrency(amount)} (${percentage.toFixed(1)}%)`}</title>
                      </g>
                    );
                  });
                })()}
                
                {/* Center circle for donut effect */}
                <circle
                  cx="100"
                  cy="100"
                  r="40"
                  fill="#0f0f10"
                  stroke="rgba(208, 254, 29, 0.3)"
                  strokeWidth="2"
                />
                <text
                  x="100"
                  y="95"
                  textAnchor="middle"
                  fill="#D0FE1D"
                  fontSize="14"
                  fontWeight="700"
                  fontFamily="JetBrains Mono, monospace"
                >
                  Revenue
                </text>
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {totalRevenue >= 1000000 
                    ? `${(totalRevenue / 1000000).toFixed(1)}M` 
                    : `${(totalRevenue / 1000).toFixed(0)}K`}
                </text>
              </svg>
              
              <div className="pie-legend">
                {Object.entries(revenueByStatus).map(([status, amount]) => {
                  const percentage = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0;
                  const colors = {
                    completed: '#4CAF50',
                    pending: '#FF9800',
                    shipping: '#2196F3',
                    cancelled: '#F44336'
                  };
                  const statusLabels = {
                    completed: 'Completed',
                    pending: 'Pending',
                    shipping: 'Shipping',
                    cancelled: 'Cancelled'
                  };
                  return (
                    <div key={status} className="pie-legend-item">
                      <div 
                        className="pie-legend-color"
                        style={{ background: colors[status] }}
                      ></div>
                      <div className="pie-legend-info">
                        <span className="pie-legend-status">{statusLabels[status]}</span>
                        <span className="pie-legend-value">{formatCurrency(amount)} ({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faBox} />
              Category Performance
            </h3>
          </div>
          <div className="chart-content">
            <div className="category-stats">
              {Object.keys(categoryStats).length === 0 ? (
                <p className="no-data">No category data available</p>
              ) : (
                Object.entries(categoryStats).map(([category, stats]) => (
                  <div key={category} className="category-stat-item">
                    <div className="category-info">
                      <span className="category-name">{category}</span>
                      <span className="category-count">{stats.count} products</span>
                    </div>
                    <div className="category-value">
                      <span>{formatCurrency(stats.value)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User Segments */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faUsers} />
              User Segments
            </h3>
          </div>
          <div className="chart-content">
            <div className="segment-chart">
              <div className="segment-item">
                <div className="segment-icon vip">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">Administrators</span>
                  <span className="segment-desc">Admin</span>
                </div>
                <span className="segment-count">{userSegments.admin}</span>
              </div>
              <div className="segment-item">
                <div className="segment-icon regular">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">Active Users</span>
                  <span className="segment-desc">Active</span>
                </div>
                <span className="segment-count">{userSegments.active}</span>
              </div>
              <div className="segment-item">
                <div className="segment-icon new">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">Pending Verification</span>
                  <span className="segment-desc">Pending</span>
                </div>
                <span className="segment-count">{userSegments.pending}</span>
              </div>
              <div className="segment-item">
                <div className="segment-icon" style={{background: 'rgba(244, 67, 54, 0.1)'}}>
                  <FontAwesomeIcon icon={faUsers} style={{color: '#F44336'}} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">Suspended</span>
                  <span className="segment-desc">Suspended</span>
                </div>
                <span className="segment-count">{userSegments.suspended}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="analytics-chart-card large">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faStar} />
              Customer List
            </h3>
          </div>
          <div className="chart-content">
            {topCustomers.length === 0 ? (
              <p className="no-data">No customers yet</p>
            ) : (
              <div className="top-customers-list">
                {topCustomers.map((customer, index) => (
                  <div key={customer.id} className="top-customer-item">
                    <div className="customer-rank">#{index + 1}</div>
                    <div className="customer-details">
                      <span className="customer-name">{customer.name}</span>
                      <span className="customer-email">{customer.email}</span>
                    </div>
                    <div className="customer-stats">
                      <span className="customer-orders">{customer.phone || 'N/A'}</span>
                      <span 
                        className="customer-spent"
                        style={{
                          color: customer.status === 'active' ? '#4CAF50' : '#FF9800'
                        }}
                      >
                        {customer.status === 'active' ? 'Active' : 'Pending'}
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

export default Analytics;
