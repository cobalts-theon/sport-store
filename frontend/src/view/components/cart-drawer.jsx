import React from 'react';
import './components-style/cart-drawer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function CartDrawer({ isOpen, onClose }) {
    // Mock cart items - in real app, this would come from context/state management
    const [cartItems] = React.useState([]); //Khai bán biến cartItems để lưu giá trị của giỏ hàng
    const hasItems = cartItems.length > 0; //Kiểm tra nếu giỏ hàng có ít nhất 1 sản phẩm thì hiển thị nút CHECKOUT

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
                    <div className="close-cart-btn-wrapper" onClick={onClose}>
                        <button className="close-cart-btn">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
                <div className="cart-content">
                    {!hasItems ? (  //Nếu giỏ hàng không có sản phẩm thì hiển thị thông báo "Your cart is currently empty."
                        <div className="empty-cart-msg">
                            Your cart is currently empty.
                        </div>
                    ) : (  //Nếu giỏ hàng có sản phẩm thì hiển thị danh sách sản phẩm trong giỏ hàng
                        <div className="cart-items-list">
                            {/* Cart items will be displayed here */}
                        </div>
                    )}
                </div>
                {hasItems && (  //Nếu giỏ hàng có sản phẩm thì hiển thị nút CHECKOUT
                    <div className="cart-footer">
                        <Link to="/products" className="checkout-btn-link" onClick={onClose}>
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
