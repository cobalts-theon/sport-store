import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Tạo Context
const CartContext = createContext();

// Helper: lấy user ID từ localStorage
const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        return user?.id || null;
    } catch {
        return null;
    }
};

// Helper: lấy cart key dựa trên user (mỗi user có cart riêng)
const getCartKey = () => {
    const userId = getUserId();
    return userId ? `cart_user_${userId}` : 'cart_guest';
};

// Custom hook để sử dụng Cart Context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    // Lưu currentCartKey để theo dõi khi user thay đổi
    const [currentCartKey, setCurrentCartKey] = useState(getCartKey);

    // Khởi tạo cart từ localStorage dựa trên user hiện tại
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem(getCartKey());
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            return [];
        }
    });

    // Lắng nghe thay đổi user (login/logout) để load đúng cart
    useEffect(() => {
        const checkUserChange = () => {
            const newCartKey = getCartKey();
            if (newCartKey !== currentCartKey) {
                // User đã thay đổi, load cart mới
                setCurrentCartKey(newCartKey);
                try {
                    const savedCart = localStorage.getItem(newCartKey);
                    setCartItems(savedCart ? JSON.parse(savedCart) : []);
                } catch (error) {
                    console.error('Error loading cart:', error);
                    setCartItems([]);
                }
            }
        };

        // Check khi storage thay đổi (login/logout ở tab khác)
        window.addEventListener('storage', checkUserChange);
        
        // Check định kỳ (cho cùng tab)
        const interval = setInterval(checkUserChange, 500);

        return () => {
            window.removeEventListener('storage', checkUserChange);
            clearInterval(interval);
        };
    }, [currentCartKey]);

    // Lưu cart vào localStorage mỗi khi có thay đổi
    useEffect(() => {
        localStorage.setItem(currentCartKey, JSON.stringify(cartItems));
    }, [cartItems, currentCartKey]);

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
        setCartItems(prevItems => {
            // Tìm xem sản phẩm đã có trong giỏ chưa (với cùng size và color)
            const existingItemIndex = prevItems.findIndex(
                item => item.id === product.id && 
                        item.selectedSize === selectedSize && 
                        item.selectedColor === selectedColor
            );

            if (existingItemIndex > -1) {
                // Nếu đã có, tăng số lượng nhưng không vượt quá stock
                const updatedItems = [...prevItems];
                const existing = updatedItems[existingItemIndex];
                const availableStock = Number(product.stock ?? existing.stock ?? Infinity);
                let newQty = existing.quantity + quantity;
                if (Number.isFinite(availableStock)) {
                    if (newQty > availableStock) {
                        newQty = availableStock;
                        toast.error(`Only ${availableStock} in stock for ${product.name}`);
                    } else {
                        toast.success(`Updated quantity for ${product.name}`);
                    }
                } else {
                    toast.success(`Updated quantity for ${product.name}`);
                }
                updatedItems[existingItemIndex] = { ...existing, quantity: newQty };
                return updatedItems;
            } else {
                // Nếu chưa có, thêm mới
                // Xử lý đường dẫn ảnh và respect stock nếu có
                let imgUrl = product.img || product.image || product.img_url || '';
                if (imgUrl && !imgUrl.startsWith('http')) {
                    imgUrl = `http://localhost:3000${imgUrl}`;
                }
                const availableStock = Number(product.stock ?? Infinity);
                let finalQty = quantity;
                if (Number.isFinite(availableStock) && quantity > availableStock) {
                    finalQty = availableStock;
                    toast.error(`Only ${availableStock} in stock for ${product.name}`);
                } else {
                    toast.success(`Added ${product.name} to cart`);
                }
                const newItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    img: imgUrl,
                    quantity: finalQty,
                    selectedSize: selectedSize,
                    selectedColor: selectedColor,
                    category: product.category,
                    stock: product.stock
                };
                return [...prevItems, newItem];
            }
        });
    };

    // Xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId, selectedSize = null, selectedColor = null) => {
        setCartItems(prevItems => {
            const itemToRemove = prevItems.find(
                item => item.id === productId && 
                        item.selectedSize === selectedSize && 
                        item.selectedColor === selectedColor
            );
            if (itemToRemove) {
                toast.success(`Removed ${itemToRemove.name} from cart`);
            }
            return prevItems.filter(
                item => !(item.id === productId && 
                         item.selectedSize === selectedSize && 
                         item.selectedColor === selectedColor)
            );
        });
    };

    // Cập nhật số lượng sản phẩm
    const updateQuantity = (productId, newQuantity, selectedSize = null, selectedColor = null) => {
        if (newQuantity < 1) {
            removeFromCart(productId, selectedSize, selectedColor);
            return;
        }

        setCartItems(prevItems => {
            return prevItems.map(item => {
                if (item.id === productId && 
                    item.selectedSize === selectedSize && 
                    item.selectedColor === selectedColor) {
                    const availableStock = Number(item.stock ?? Infinity);
                    if (Number.isFinite(availableStock) && newQuantity > availableStock) {
                        toast.error(`Only ${availableStock} in stock for ${item.name}`);
                        return { ...item, quantity: availableStock };
                    }
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
        });
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
        toast.success('Cart cleared');
    };

    // Tính tổng số lượng sản phẩm
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng tiền
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Tính tổng tiền gốc (trước giảm giá)
    const getCartOriginalTotal = () => {
        return cartItems.reduce((total, item) => {
            const price = item.originalPrice || item.price;
            return total + (price * item.quantity);
        }, 0);
    };

    // Tính số tiền tiết kiệm
    const getSavings = () => {
        return getCartOriginalTotal() - getCartTotal();
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        getCartOriginalTotal,
        getSavings
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
