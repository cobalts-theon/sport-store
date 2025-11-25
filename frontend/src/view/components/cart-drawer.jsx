import React from 'react';
import './components-style/cart-drawer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function CartDrawer({ isOpen, onClose }) {
    // Prevent body scroll when drawer is open
    React.useEffect(() => {
        if (isOpen) {
            // Prevent scrolling on body
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0px'; // Prevent layout shift from scrollbar
        } else {
            // Restore scrolling
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
                    <h2>Your Cart</h2>
                    <button className="close-cart-btn" onClick={onClose}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="cart-content">
                    {/* Placeholder for cart items */}
                    <div className="empty-cart-msg">
                        Your cart is currently empty.
                    </div>
                </div>
                <div className="cart-footer">
                    <button className="checkout-btn">
                        CHECKOUT
                    </button>
                </div>
            </div>
        </>
    );
}

export default CartDrawer;

