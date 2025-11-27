// Analytics.jsx hiển thị bảng điều khiển phân tích với các chỉ số hiệu suất chính và biểu đồ cho trang quản trị
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

function Analytics({ products, orders, users }) {
  const [timeRange, setTimeRange] = useState('30days');
  
  // Calculate analytics data
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
  
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  const conversionRate = users.length > 0 
    ? ((orders.length / users.length) * 100).toFixed(1)
    : 0;
  
  // Revenue by status
  const revenueByStatus = {
    completed: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0),
    pending: orders.filter(o => o.status === 'pending').reduce((s, o) => s + o.total, 0),
    processing: orders.filter(o => o.status === 'processing').reduce((s, o) => s + o.total, 0),
    shipped: orders.filter(o => o.status === 'shipped').reduce((s, o) => s + o.total, 0)
  };
  
  // Category analysis
  const categoryStats = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = { count: 0, value: 0 };
    }
    acc[product.category].count++;
    acc[product.category].value += product.price * product.stock;
    return acc;
  }, {});
  
  // Customer segments
  const customerSegments = {
    vip: users.filter(u => u.totalSpent > 3000).length,
    regular: users.filter(u => u.totalSpent >= 1000 && u.totalSpent <= 3000).length,
    new: users.filter(u => u.totalSpent < 1000).length
  };
  
  // Top customers
  const topCustomers = [...users]
    .filter(u => u.totalSpent > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);
  
  // Sales by month (mock data)
  const salesData = [
    { month: 'Jan', sales: 12500, orders: 45 },
    { month: 'Feb', sales: 15800, orders: 52 },
    { month: 'Mar', sales: 18200, orders: 61 },
    { month: 'Apr', sales: 16900, orders: 58 },
    { month: 'May', sales: 21500, orders: 73 },
    { month: 'Jun', sales: 24300, orders: 82 },
    { month: 'Jul', sales: 22100, orders: 76 },
    { month: 'Aug', sales: 25600, orders: 87 },
    { month: 'Sep', sales: 23800, orders: 81 },
    { month: 'Oct', sales: 27400, orders: 94 },
    { month: 'Nov', sales: 29200, orders: 98 },
    { month: 'Dec', sales: 0, orders: 0 }
  ].filter(d => d.sales > 0);
  
  const maxSales = Math.max(...salesData.map(d => d.sales));

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
      <div className="analytics-kpi-grid">
        <div className="analytics-kpi-card">
          <div className="kpi-header">
            <span>Total Revenue</span>
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <p className="kpi-value">${totalRevenue.toFixed(2)}</p>
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
          <p className="kpi-value">${avgOrderValue.toFixed(2)}</p>
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
      <div className="analytics-charts-grid">
        {/* Sales Chart */}
        <div className="analytics-chart-card large">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faChartLine} />
              Sales Overview
            </h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{background: '#D0FE1D'}}></span>
                Revenue
              </span>
            </div>
          </div>
          <div className="chart-content">
            <div className="bar-chart">
              {salesData.map((data, index) => (
                <div key={index} className="bar-group">
                  <div className="bar-wrapper">
                    <div 
                      className="bar"
                      style={{height: `${(data.sales / maxSales) * 100}%`}}
                      title={`$${data.sales.toLocaleString()}`}
                    ></div>
                  </div>
                  <span className="bar-label">{data.month}</span>
                </div>
              ))}
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
                    processing: '#2196F3',
                    shipped: '#9C27B0'
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
                        <title>{`${status}: $${amount.toFixed(2)} (${percentage.toFixed(1)}%)`}</title>
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
                  fontSize="12"
                  fontWeight="600"
                  fontFamily="JetBrains Mono, monospace"
                >
                  ${(totalRevenue / 1000).toFixed(1)}K
                </text>
              </svg>
              
              <div className="pie-legend">
                {Object.entries(revenueByStatus).map(([status, amount]) => {
                  const percentage = totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0;
                  const colors = {
                    completed: '#4CAF50',
                    pending: '#FF9800',
                    processing: '#2196F3',
                    shipped: '#9C27B0'
                  };
                  return (
                    <div key={status} className="pie-legend-item">
                      <div 
                        className="pie-legend-color"
                        style={{ background: colors[status] }}
                      ></div>
                      <div className="pie-legend-info">
                        <span className="pie-legend-status">{status}</span>
                        <span className="pie-legend-value">${amount.toFixed(0)} ({percentage}%)</span>
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
              {Object.entries(categoryStats).map(([category, stats]) => (
                <div key={category} className="category-stat-item">
                  <div className="category-info">
                    <span className="category-name">{category}</span>
                    <span className="category-count">{stats.count} products</span>
                  </div>
                  <div className="category-value">
                    <span>${stats.value.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Segments */}
        <div className="analytics-chart-card">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faUsers} />
              Customer Segments
            </h3>
          </div>
          <div className="chart-content">
            <div className="segment-chart">
              <div className="segment-item">
                <div className="segment-icon vip">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">VIP Customers</span>
                  <span className="segment-desc">$3000+ spent</span>
                </div>
                <span className="segment-count">{customerSegments.vip}</span>
              </div>
              <div className="segment-item">
                <div className="segment-icon regular">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">Regular Customers</span>
                  <span className="segment-desc">$1000-$3000 spent</span>
                </div>
                <span className="segment-count">{customerSegments.regular}</span>
              </div>
              <div className="segment-item">
                <div className="segment-icon new">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <div className="segment-info">
                  <span className="segment-label">New Customers</span>
                  <span className="segment-desc">Under $1000 spent</span>
                </div>
                <span className="segment-count">{customerSegments.new}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Customers */}
        <div className="analytics-chart-card large">
          <div className="chart-header">
            <h3>
              <FontAwesomeIcon icon={faStar} />
              Top Customers
            </h3>
          </div>
          <div className="chart-content">
            <div className="top-customers-list">
              {topCustomers.map((customer, index) => (
                <div key={customer.id} className="top-customer-item">
                  <div className="customer-rank">#{index + 1}</div>
                  <div className="customer-details">
                    <span className="customer-name">{customer.name}</span>
                    <span className="customer-email">{customer.email}</span>
                  </div>
                  <div className="customer-stats">
                    <span className="customer-orders">{customer.totalOrders} orders</span>
                    <span className="customer-spent">${customer.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
