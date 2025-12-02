import React from 'react';
import './components-style/cart-drawer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartDrawer({ isOpen, onClose }) {
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        getCartTotal, 
        getCartOriginalTotal,
        getSavings,
        getCartCount 
    } = useCart();
    
    const hasItems = cartItems.length > 0;

    // Format price
    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + 'đ' : '0đ';
    };

    // Prevent body scroll when drawer is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px';
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    return (
        <>
            <div 
                className={`cart-overlay ${isOpen ? 'open' : ''}`} 
                onClick={onClose}
            ></div>
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart ({getCartCount()})</h2>
                    <div className="close-cart-btn-wrapper" onClick={onClose}>
                        <button className="close-cart-btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className="cart-content">
                    {!hasItems ? (
                        <div className="empty-cart-msg">
                            Your cart is currently empty.
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item, index) => {
                                // Xử lý đường dẫn ảnh
                                let imgSrc = item.img || '';
                                if (imgSrc && !imgSrc.startsWith('http')) {
                                    imgSrc = `http://localhost:3000${imgSrc}`;
                                }
                                
                                return (
                                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}-${index}`} className="cart-item">
                                    <div className="cart-item-image">
                                        <img 
                                            src={imgSrc || 'https://via.placeholder.com/80x80?text=No+Image'} 
                                            alt={item.name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                            }}
                                        />
                                    </div>
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-name">{item.name}</h4>
                                        <div className="cart-item-options">
                                            {item.selectedSize && (
                                                <span className="cart-item-size">Size: {item.selectedSize}</span>
                                            )}
                                            {item.selectedColor && (
                                                <span className="cart-item-color">Color: {item.selectedColor}</span>
                                            )}
                                        </div>
                                        <div className="cart-item-price-row">
                                            <span className="cart-item-price">{formatPrice(item.price)}</span>
                                            {item.originalPrice && item.originalPrice > item.price && (
                                                <span className="cart-item-original-price">{formatPrice(item.originalPrice)}</span>
                                            )}
                                        </div>
                                        <div className="cart-item-actions">
                                            <div className="cart-quantity-control">
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} />
                                                </button>
                                                <span className="qty-value">{item.quantity}</span>
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </button>
                                            </div>
                                            <button 
                                                className="remove-item-btn"
                                                onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {hasItems && (
                    <div className="cart-footer">
                        <div className="cart-summary">
                            {getSavings() > 0 && (
                                <div className="cart-savings">
                                    <span>You save:</span>
                                    <span className="savings-amount">-{formatPrice(getSavings())}</span>
                                </div>
                            )}
                            <div className="cart-total">
                                <span>Total:</span>
                                <span className="total-amount">{formatPrice(getCartTotal())}</span>
                            </div>
                        </div>
                        <Link to="/checkout" className="checkout-btn-link" onClick={onClose}>
                            <button className="checkout-btn">
                                CHECKOUT
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
    
export default CartDrawer;
