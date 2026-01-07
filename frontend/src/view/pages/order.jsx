import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTruck, faCheckCircle, faTimesCircle,faClockRotateLeft, faChevronDown, faChevronUp, faBan} from '@fortawesome/free-solid-svg-icons';
import './pages-style/order.css';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function Order() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState(null);

  // Handle cancel order (only for pending orders)
  const handleCancelOrder = async (rawId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        setCancellingOrder(rawId);
        await api.patch(`/orders/${rawId}/status`, { status: 'cancelled' });
        setOrders(orders.map(order => 
          order.rawId === rawId 
            ? { ...order, status: 'cancelled' } 
            : order
        ));
        toast.success('Order cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling order:', error);
        toast.error('Failed to cancel order');
      } finally {
        setCancellingOrder(null);
      }
    }
  };

  // Fetch orders từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Lấy user từ localStorage
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!user || !user.id) {
          // Nếu chưa đăng nhập, chuyển về login
          toast.error('Please login to view your orders');
          navigate('/login');
          return;
        }

        const res = await api.get(`/orders/user/${user.id}`);
        
        // Transform data từ API sang format phù hợp
        const transformedOrders = (res.data || []).map(order => ({
          id: `ORD-${order.id}`,
          rawId: order.id,
          date: order.createdAt,
          status: order.status || 'processing',
          total: Number(order.totalAmount) || 0,
          items: (order.OrderItems || []).map(item => ({
            name: item.Product?.name || 'Unknown Product',
            quantity: item.quantity,
            price: Number(item.price) || 0,
            image: item.Product?.img_url 
              ? (item.Product.img_url.startsWith('http') 
                  ? item.Product.img_url 
                  : `http://localhost:3000${item.Product.img_url}`)
              : '/src/assets/image/placeholder.png'
          })),
          shipping: {
            address: order.address || 'N/A',
            fullName: order.fullName || '',
            email: order.email || '',
            phone: order.phone || '',
            method: 'Standard Delivery',
            tracking: order.trackingNumber || 'Pending'
          }
        }));

        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Format tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return faCheckCircle;
      case 'shipping':
        return faTruck;
      case 'pending':
        return faBox;
      case 'cancelled':
        return faTimesCircle;
      default:
        return faClockRotateLeft;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'shipping':
        return '#2196F3';
      case 'pending':
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
            className={`filter-btn ${selectedStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'shipping' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('shipping')}
          >
            Shipping
          </button>
          <button 
            className={`filter-btn ${selectedStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setSelectedStatus('completed')}
          >
            Completed
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
                      <p className="item-price">{formatCurrency(item.price)}</p>
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
                    <span className="total-amount">{formatCurrency(order.total)}</span>
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
                      <h4>Customer</h4>
                      <p>{order.shipping.fullName}</p>
                    </div>
                    <div className="details-section">
                      <h4>Contact</h4>
                      <p>{order.shipping.email}</p>
                      <p>{order.shipping.phone}</p>
                    </div>
                    <div className="details-section">
                      <h4>Shipping Address</h4>
                      <p>{order.shipping.address}</p>
                    </div>
                    <div className="details-section">
                      <h4><FontAwesomeIcon icon={faTruck} style={{ marginRight: '8px' }} />Tracking Number</h4>
                      {order.shipping.tracking && order.shipping.tracking !== 'Pending' ? (
                        <div className="tracking-info">
                          <p className="tracking-number has-tracking">{order.shipping.tracking}</p>
                          <p className="tracking-hint">Use this code to track your package with the carrier</p>
                        </div>
                      ) : (
                        <p className="tracking-number no-tracking">Awaiting shipment - tracking will be available soon</p>
                      )}
                    </div>
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <div className="order-actions">
                        {/* Cancel button - only show for pending orders */}
                        {order.status === 'pending' && (
                          <button 
                            className="action-btn danger"
                            onClick={() => handleCancelOrder(order.rawId)}
                            disabled={cancellingOrder === order.rawId}
                          >
                            <FontAwesomeIcon icon={faBan} /> 
                            {cancellingOrder === order.rawId ? 'CANCELLING...' : 'CANCEL ORDER'}
                          </button>
                        )}
                        {order.shipping.tracking && order.shipping.tracking !== 'Pending' && (
                          <button 
                            className="action-btn primary"
                            onClick={() => {
                              // Copy tracking number to clipboard
                              navigator.clipboard.writeText(order.shipping.tracking);
                              toast.success('Tracking number copied to clipboard!');
                            }}
                          >
                            <FontAwesomeIcon icon={faTruck} /> COPY TRACKING
                          </button>
                        )}
                        <Link to="/products" className="action-btn secondary">
                          BUY AGAIN
                        </Link>
                      </div>
                    )}
                    {order.status === 'cancelled' && (
                      <div className="order-actions">
                        <Link to="/products" className="action-btn secondary">
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

