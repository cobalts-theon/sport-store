import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart,
  faCreditCard,
  faMapMarkerAlt,
  faUser,
  faEnvelope,
  faPhone,
  faLock,
  faChevronRight,
  faChevronLeft,
  faTag,
  faTimes,
  faCheck,
  faSpinner,
  faGift,
  faPercent,
  faChevronDown,
  faChevronUp,
  faMoneyBillWave,
  faQrcode,
  faUniversity
} from '@fortawesome/free-solid-svg-icons';
import './pages-style/checkout.css';
import { useCart } from '../context/CartContext';
import CreditCard from '../components/CreditCard';
import api from '../../lib/api';
import toast from 'react-hot-toast';

function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCoupons, setShowCoupons] = useState(false);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnam'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'cod', 'bank'

  const subtotal = getCartTotal();
  const shipping = 30000;
  const tax = 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + shipping + tax - discount;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Apply coupon handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    setCouponLoading(true);
    setCouponError('');
    
    try {
      const res = await api.post('/coupons/apply', {
        code: couponCode.toUpperCase(),
        orderTotal: subtotal
      });
      
      setAppliedCoupon({
        code: res.data.code,
        discountAmount: res.data.discountAmount,
        newTotal: res.data.newTotal
      });
      setCouponCode('');
      toast.success(`Coupon applied! You saved ${formatCurrency(res.data.discountAmount)}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply coupon';
      setCouponError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon handler
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.success('Coupon removed');
  };

  // Fetch available coupons
  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      setLoadingCoupons(true);
      try {
        const res = await api.get('/coupons/available');
        setAvailableCoupons(res.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoadingCoupons(false);
      }
    };
    fetchAvailableCoupons();
  }, []);

  // Quick apply coupon from list
  const handleQuickApplyCoupon = async (coupon) => {
    if (subtotal < coupon.minOrderAmount) {
      toast.error(`Minimum order ${formatCurrency(coupon.minOrderAmount)} required for this coupon`);
      return;
    }
    
    setCouponCode(coupon.code);
    setCouponLoading(true);
    setCouponError('');
    
    try {
      const res = await api.post('/coupons/apply', {
        code: coupon.code,
        orderTotal: subtotal
      });
      
      setAppliedCoupon({
        code: res.data.code,
        discountAmount: res.data.discountAmount,
        newTotal: res.data.newTotal
      });
      setCouponCode('');
      setShowCoupons(false);
      toast.success(`Coupon applied! You saved ${formatCurrency(res.data.discountAmount)}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply coupon';
      setCouponError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setStep(3);
  };

  const handlePlaceOrder = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const place = async () => {
      setPlacing(true);
      try {
        const payload = {
          fullName: shippingInfo.fullName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.zipCode}, ${shippingInfo.country}`,
          cartItems: cartItems.map(ci => ({ id: ci.id, quantity: ci.quantity })),
          userId: null,
          subtotal: subtotal,
          shippingFee: shipping,
          discount: discount,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          totalAmount: total,
          paymentMethod: paymentMethod
        };

        // attach userId if present in localStorage
        try {
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          if (user && user.id) payload.userId = user.id;
        } catch (e) {
          // ignore
        }

        const res = await api.post('/orders', payload);
        if (res && (res.status === 200 || res.status === 201)) {
          toast.success('Order placed successfully');
          clearCart();
          // navigate to order page or order confirmation
    navigate('/order');

            } else {
          toast.error('Failed to place order');
        }
      } catch (err) {
        console.error('Order error', err);
        toast.error(err?.response?.data?.message || 'Error placing order');
      } finally {
        setPlacing(false);
      }
    };

    place();
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span className="step-label">Shipping</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span className="step-label">Review</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Left Column - Forms */}
          <div className="checkout-forms">
            
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="checkout-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <h2>Shipping Information</h2>
                </div>
                <form onSubmit={handleShippingSubmit} className="checkout-form">
                  <div className="form-row">
                    <div className="form-group full">
                      <label><FontAwesomeIcon icon={faUser} /> Full Name</label>
                      <input 
                        type="text" 
                        placeholder="John Doe"
                        value={shippingInfo.fullName}
                        onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label><FontAwesomeIcon icon={faEnvelope} /> Email</label>
                      <input 
                        type="email" 
                        placeholder="john@example.com"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label><FontAwesomeIcon icon={faPhone} /> Phone</label>
                      <input 
                        type="tel" 
                        placeholder="+1 (555) 000-0000"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full">
                      <label>Address</label>
                      <input 
                        type="text" 
                        placeholder="123 Street Name"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input 
                        type="text" 
                        placeholder="New York"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input 
                        type="text" 
                        placeholder="NY"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input 
                        type="text" 
                        placeholder="10001"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <select 
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="checkout-btn primary">
                    Continue to Payment
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Payment Information */}
            {step === 2 && (
              <div className="checkout-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faCreditCard} />
                  <h2>Payment Method</h2>
                </div>
                
                <div className="payment-methods">
                  <div 
                    className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="payment-icon">
                      <FontAwesomeIcon icon={faCreditCard} />
                    </div>
                    <div className="payment-details">
                      <h3>Credit/Debit Card</h3>
                      <p>Pay securely with your card</p>
                    </div>
                    <div className="payment-radio">
                      <div className="radio-circle"></div>
                    </div>
                  </div>

                  <div 
                    className={`payment-method-card ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-icon">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                    </div>
                    <div className="payment-details">
                      <h3>Cash on Delivery</h3>
                      <p>Pay when you receive your order</p>
                    </div>
                    <div className="payment-radio">
                      <div className="radio-circle"></div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handlePaymentSubmit} className="checkout-form">
                  {paymentMethod === 'card' && (
                    <div className="card-payment-form">
                      <div className="form-row">
                        <div className="form-group full">
                          <label>Card Number</label>
                          <input 
                            type="text" 
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                            maxLength="19"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group full">
                          <label>Cardholder Name</label>
                          <input 
                            type="text" 
                            placeholder="John Doe"
                            value={paymentInfo.cardName}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            maxLength="5"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label><FontAwesomeIcon icon={faLock} /> CVV</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            maxLength="3"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="payment-info-box">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                      <p>You will pay in cash upon delivery. Please prepare the exact amount if possible.</p>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="payment-info-box">
                      <FontAwesomeIcon icon={faQrcode} />
                      <p>You will be redirected to scan a QR code for bank transfer after placing the order.</p>
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="button" className="checkout-btn secondary" onClick={() => setStep(1)}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                      Back to Shipping
                    </button>
                    <button type="submit" className="checkout-btn primary">
                      Review Order
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="checkout-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  <h2>Review Your Order</h2>
                </div>
                
                <div className="review-section">
                  <h3>Shipping Information</h3>
                  <div className="review-info">
                    <p><strong>{shippingInfo.fullName}</strong></p>
                    <p>{shippingInfo.email}</p>
                    <p>{shippingInfo.phone}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                    <p>{shippingInfo.country}</p>
                  </div>
                  <button className="edit-btn" onClick={() => setStep(1)}>Edit</button>
                </div>

                <div className="review-section">
                  <h3>Payment Method</h3>
                  <div className="review-info">
                    {paymentMethod === 'card' && (
                      <>
                        <p>Credit/Debit Card</p>
                        <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                        <p>{paymentInfo.cardName}</p>
                      </>
                    )}
                    {paymentMethod === 'cod' && (
                      <p>Cash on Delivery</p>
                    )}
                  </div>
                  <button className="edit-btn" onClick={() => setStep(2)}>Edit</button>
                </div>

                <div className="form-actions">
                  <button type="button" className="checkout-btn secondary" onClick={() => setStep(2)}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    Back to Payment   
                  </button>
                  <button type="button" className="checkout-btn primary" onClick={handlePlaceOrder} disabled={placing || cartItems.length === 0}>
                    {placing ? 'Placing order...' : 'Place Order'}
                    <FontAwesomeIcon icon={faLock} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-summary">
            {step === 2 && paymentMethod === 'card' && (
              <div style={{ marginBottom: '25px' }}>
                <CreditCard 
                  cardNumber={paymentInfo.cardNumber}
                  cardName={paymentInfo.cardName}
                  expiryDate={paymentInfo.expiryDate}
                  cvv={paymentInfo.cvv}
                />
              </div>
            )}
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="summary-item">
                  <img src={item.img} alt={item.name} />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="summary-item-quantity">Qty: {item.quantity}</p>
                    {item.selectedSize && <p className="summary-item-variant">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="summary-item-variant">Color: {item.selectedColor}</p>}
                  </div>
                  <p className="summary-item-price">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <h4><FontAwesomeIcon icon={faTag} /> Discount Code</h4>
              {appliedCoupon ? (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <FontAwesomeIcon icon={faCheck} className="coupon-success-icon" />
                    <span className="coupon-code-applied">{appliedCoupon.code}</span>
                    <span className="coupon-discount">-{formatCurrency(appliedCoupon.discountAmount)}</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError('');
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className={couponError ? 'error' : ''}
                    />
                    <button 
                      className="apply-coupon-btn" 
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        'Apply'
                      )}
                    </button>
                  </div>
                  
                  {/* Available Coupons Toggle */}
                  {availableCoupons.length > 0 && (
                    <div className="available-coupons-section">
                      <button 
                        className="show-coupons-btn"
                        onClick={() => setShowCoupons(!showCoupons)}
                      >
                        <FontAwesomeIcon icon={faGift} />
                        <span>View available coupons ({availableCoupons.length})</span>
                        <FontAwesomeIcon icon={showCoupons ? faChevronUp : faChevronDown} />
                      </button>
                      
                      {showCoupons && (
                        <div className="coupons-list">
                          {loadingCoupons ? (
                            <div className="coupons-loading">
                              <FontAwesomeIcon icon={faSpinner} spin /> Loading...
                            </div>
                          ) : (
                            availableCoupons.map(coupon => {
                              const isEligible = subtotal >= coupon.minOrderAmount;
                              const discountText = coupon.discountType === 'percent' 
                                ? `${coupon.discountValue}% OFF`
                                : `${formatCurrency(coupon.discountValue)} OFF`;
                              
                              return (
                                <div 
                                  key={coupon.id} 
                                  className={`coupon-card ${!isEligible ? 'disabled' : ''}`}
                                  onClick={() => isEligible && handleQuickApplyCoupon(coupon)}
                                >
                                  <div className="coupon-card-left">
                                    <div className="coupon-card-icon">
                                      <FontAwesomeIcon icon={faPercent} />
                                    </div>
                                  </div>
                                  <div className="coupon-card-content">
                                    <div className="coupon-card-code">{coupon.code}</div>
                                    <div className="coupon-card-discount">{discountText}</div>
                                    <div className="coupon-card-condition">
                                      {coupon.minOrderAmount > 0 
                                        ? `Min order: ${formatCurrency(coupon.minOrderAmount)}`
                                        : 'No minimum order'
                                      }
                                    </div>
                                    {!isEligible && (
                                      <div className="coupon-card-warning">
                                        Add {formatCurrency(coupon.minOrderAmount - subtotal)} more to use
                                      </div>
                                    )}
                                  </div>
                                  <div className="coupon-card-action">
                                    {isEligible ? (
                                      <span className="use-btn">Use</span>
                                    ) : (
                                      <FontAwesomeIcon icon={faLock} className="locked-icon" />
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              {couponError && <p className="coupon-error">{couponError}</p>}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              {appliedCoupon && (
                <div className="summary-row discount">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="discount-amount">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
