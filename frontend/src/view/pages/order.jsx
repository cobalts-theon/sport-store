import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, 
  faTruck, 
  faCheckCircle, 
  faTimesCircle,
  faClockRotateLeft,
  faEye,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import './pages-style/order.css';

function Order() {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: 'ORD-2025-001',
          date: '2025-11-20',
          status: 'delivered',
          total: 299.99,
          items: [
            { name: 'Air Max 97 Silver Bullet', quantity: 1, price: 299.99, image: '/src/assets/image/1.png' }
          ],
          shipping: {
            address: '123 Street Name, City, State 12345',
            method: 'Express Delivery',
            tracking: 'TRK123456789'
          }
        },
        {
          id: 'ORD-2025-002',
          date: '2025-11-22',
          status: 'shipping',
          total: 449.98,
          items: [
            { name: 'Jordan 1 Retro High', quantity: 1, price: 249.99, image: '/src/assets/image/2.png' },
            { name: 'Nike Dunk Low', quantity: 1, price: 199.99, image: '/src/assets/image/3.jpg' }
          ],
          shipping: {
            address: '456 Avenue Road, Town, State 67890',
            method: 'Standard Delivery',
            tracking: 'TRK987654321'
          }
        },
        {
          id: 'ORD-2025-003',
          date: '2025-11-24',
          status: 'processing',
          total: 349.99,
          items: [
            { name: 'Yeezy Boost 350', quantity: 1, price: 349.99, image: '/src/assets/image/4.jpg' }
          ],
          shipping: {
            address: '789 Boulevard Street, City, State 13579',
            method: 'Express Delivery',
            tracking: 'Pending'
          }
        },
        {
          id: 'ORD-2025-004',
          date: '2025-11-15',
          status: 'cancelled',
          total: 199.99,
          items: [
            { name: 'Converse Chuck 70', quantity: 1, price: 199.99, image: '/src/assets/image/5.jpg' }
          ],
          shipping: {
            address: '321 Park Lane, Village, State 24680',
            method: 'Standard Delivery',
            tracking: 'Cancelled'
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return faCheckCircle;
      case 'shipping':
        return faTruck;
      case 'processing':
        return faBox;
      case 'cancelled':
        return faTimesCircle;
      default:
        return faClockRotateLeft;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'shipping':
        return '#2196F3';
      case 'processing':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="order-page">
        <div className="order-loading">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="order-container">
        {/* Header */}
        <div className="order-header">
          <h1 className="order-title">My Orders</h1>
          <p className="order-subtitle">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="order-filters">
          <button 
            className={`filter-btn ${selectedStatus === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'processing' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('processing')}
          >
            Processing
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'shipping' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('shipping')}
          >
            Shipping
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'delivered' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('delivered')}
          >
            Delivered
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('cancelled')}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <FontAwesomeIcon icon={faBox} className="no-orders-icon" />
              <h2>No orders found</h2>
              <p>You haven't placed any orders yet</p>
              <Link to="/products" className="shop-now-btn">
                SHOP NOW
              </Link>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-card-header">
                  <div className="order-info">
                    <h3 className="order-id">{order.id}</h3>
                    <span className="order-date">{new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="order-status" style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                    <FontAwesomeIcon icon={getStatusIcon(order.status)} />
                    <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="item-preview">
                      <img src={item.image} alt={item.name} />
                      <div className="item-preview-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                      </div>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="more-items">+{order.items.length - 3} more item(s)</p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="order-card-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                  <button 
                    className="view-details-btn"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    {expandedOrder === order.id ? 'HIDE DETAILS' : 'VIEW DETAILS'}
                    <FontAwesomeIcon icon={expandedOrder === order.id ? faChevronUp : faChevronDown} />
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="order-details-expanded">
                    <div className="details-section">
                      <h4>Shipping Address</h4>
                      <p>{order.shipping.address}</p>
                    </div>
                    <div className="details-section">
                      <h4>Shipping Method</h4>
                      <p>{order.shipping.method}</p>
                    </div>
                    <div className="details-section">
                      <h4>Tracking Number</h4>
                      <p className="tracking-number">{order.shipping.tracking}</p>
                    </div>
                    {order.status !== 'cancelled' && (
                      <div className="order-actions">
                        <button className="action-btn primary">
                          TRACK ORDER
                        </button>
                        <Link to={`/product/${order.items[0].name}`} className="action-btn secondary">
                          BUY AGAIN
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;

