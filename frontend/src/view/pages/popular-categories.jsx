import { useState, useEffect } from 'react';
import "./pages-style/popular-categories.css";
import productsData from "../data/products.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

function PopularCategories() {
    const baseProducts = productsData.filter(p => p.id <= 8);
    // Lặp lại 3 lần để lấp đầy vòng tròn (8 mục * 30 độ * 3 = 360 độ)
    const products = [...baseProducts, ...baseProducts, ...baseProducts]; 
    const [rotation, setRotation] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startRotation, setStartRotation] = useState(0);
    
    const RADIUS = 1500; // Vòng bán kính lớn để tạo cung nhẹ nhàng
    const ITEM_SPACING = 30; // Tăng khoảng cách giữa các mục

    // Xử lý bắt đầu kéo chuột hoặc cảm ứng
    const handleMouseDown = (e) => {
        setIsDragging(true);    
        setStartX(e.pageX || e.touches[0].pageX);   // Lấy tọa độ X ban đầu
        setStartRotation(rotation);
        document.body.style.cursor = 'grabbing';    // Cập nhật con trỏ khi kéo
    };

    // Xử lý di chuyển chuột hoặc cảm ứng
    const handleMouseMove = (e) => {
        if (!isDragging) return;    // Nếu không đang kéo thì không làm gì
        const currentX = e.pageX || (e.touches ? e.touches[0].pageX : 0);    // Lấy tọa độ X hành tác
        const diff = currentX - startX;
        // Cảm ứng di chuyển nhanh hơn chuột
        setRotation(startRotation + (diff * 0.05));
    };

    // Xử lý kết thúc kéo chuột hoặc cảm ứng
    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = 'default';
    };

    // Thêm và xóa sự kiện lắng nghe khi kéo
    useEffect(() => {
        if (isDragging) {   // Khi đang kéo
            window.addEventListener('mousemove', handleMouseMove);  // Thêm lắng nghe di chuyển chuột
            window.addEventListener('mouseup', handleMouseUp);  // Thêm lắng nghe kết thúc keo
            window.addEventListener('touchmove', handleMouseMove);  // Thêm lắng nghe di chuyển cảm ứng
            window.addEventListener('touchend', handleMouseUp); // Thêm lắng nghe kết thúc cảm ứng
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleMouseMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="popular-categories">
            <div className="Circle-background"></div>
            <h1 className="popular-categories-title">
                <FontAwesomeIcon icon={faSquare} style={{ fontSize: '30px' }}/> POPULAR CATEGORIES
            </h1>
            <p className="popular-categories-subtitle"><FontAwesomeIcon icon={faSquare} /> Explore our most popular product categories, and find the perfect fit for your needs</p>
            <div 
                className="arc-slider-container"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="arc-center" style={{ top: `${RADIUS + 150}px` }}>
                    {products.map((product, index) => {
                        // Center the group of items around 0 degrees initially
                        const offsetAngle = (index - (products.length - 1) / 2) * ITEM_SPACING;
                        const currentAngle = offsetAngle + rotation;
                        
                        // Normalize angle to 0-360
                        const normalizedAngle = ((currentAngle % 360) + 360) % 360;
                        
                        // Only show cards in the upper arc (approx -100 to 100 degrees)
                        // 0 is top, 90 is right, 270 is left.
                        // Hide if angle > 100 and < 260 (i.e., in the bottom half)
                        const isVisible = normalizedAngle < 100 || normalizedAngle > 260;

                        return (
                            <div 
                                key={`${product.id}-${index}`} 
                                className="arc-item-wrapper"
                                style={{
                                    transform: `rotate(${currentAngle}deg)`,
                                    transformOrigin: `0 0`,
                                    opacity: isVisible ? 1 : 0, // Hide if behind
                                    pointerEvents: isVisible ? 'auto' : 'none',
                                    transition: 'opacity 0.2s ease'
                                }}
                            >
                                <div 
                                    className="arc-item-card"
                                    style={{
                                        // Removed counter-rotation to align tangentially (spoke-like)
                                        transform: `translateY(-${RADIUS}px)`
                                    }}
                                >
                                    <div className="arc-item-content">
                                        <img src={product.img} alt={product.name} draggable="false" className="arc-img"/>
                                        <div className="arc-item-info">
                                            <h3 className="arc-name">{product.name}</h3>
                                            <a href={product.link} className="arc-btn">SHOP NOW</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default PopularCategories;
