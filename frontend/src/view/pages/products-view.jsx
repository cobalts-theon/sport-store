import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api';
import axios from 'axios';
import productsData from '../data/products.json';
import './pages-style/products-view.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faBolt, faStar, faTimes, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

function ProductsView({ openCart }) {
    // Get product ID from URL params
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock multiple images for the carousel
    const [productImages, setProductImages] = useState([]);

    // Mock Colors
    const colors = [
        { name: 'Black', code: '#000000' },
        { name: 'White', code: '#ffffff' },
        { name: 'Blue', code: '#0000ff' },
        { name: 'Orange', code: '#ff9500ff' }
    ];

    // Size Chart Data
    const clothingSizes = ['S', 'M', 'L', 'XL'];
    const shoeSizes = ['39', '40', '41', '42', '43', '44'];

    const sizeChart = {
        clothing: {
            headers: ['Size', 'Chest (cm)', 'Length (cm)', 'Shoulder (cm)'],
            rows: [
                ['S', '90-94', '65', '40-42'],
                ['M', '95-99', '67', '42-44'],
                ['L', '100-104', '69', '44-46'],
                ['XL', '105-110', '71', '46-48']
            ],
            sizes: clothingSizes
        },
        shoes: {
            headers: ['Size VN', 'Length-Foot (cm)'],
            rows: [
                ['39', '24.5'],
                ['40', '25'],
                ['41', '26'],
                ['42', '26.5'],
                ['43', '27.5'],
                ['44', '28']
            ],
            sizes: shoeSizes
        }
    };

    //Map các category để xác định loại size
    const getCategoryType = (category) => {
        if (!category) return null;
        const cat = category.toLowerCase();
        // Shoe categories
        if (['shoes', 'sneakers', 'running', 'basketball', 'training', 'lifestyle'].includes(cat)) {
            return 'shoes';
        }
        // Clothing categories
        if (['clothing', 'apparel', 't-shirt', 'shirt', 'jacket', 'hoodie', 'pants', 'shorts'].includes(cat)) {
            return 'clothing';
        }
        return null; // Accessories, etc. - no size
    };

    const categoryType = product ? getCategoryType(product.category) : null;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch từ API
                const response = await api.get(`/products/${id}`);
                const productData = response.data;
                
                console.log('API Response:', productData); // Debug log
                
                // Map data từ API
                const mappedProduct = {
                    id: productData.id,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    originalPrice: productData.original_price,
                    img: productData.img_url ? (productData.img_url.startsWith('http') ? productData.img_url : `http://localhost:3000${productData.img_url}`) : '',
                    hover: productData.hover ? (productData.hover.startsWith('http') ? productData.hover : `http://localhost:3000${productData.hover}`) : '',
                    images: productData.images || [],
                    tag: productData.tag,
                    category: productData.category,
                    material: productData.material,
                    brand: productData.brand,
                    isHotDeal: productData.isHotDeal,
                    stock: productData.stock
                };
                
                console.log('Mapped Product:', mappedProduct); // Debug log
                
                setProduct(mappedProduct);
                
                const mainImg = mappedProduct.img;
                setSelectedImage(mainImg);
                
                // Build images array: main image + hover + additional images
                const images = [];
                if (mainImg) images.push(mainImg);
                if (mappedProduct.hover && mappedProduct.hover !== mainImg) {
                    images.push(mappedProduct.hover);
                }
                // Add additional images from API
                if (mappedProduct.images && Array.isArray(mappedProduct.images)) {
                    mappedProduct.images.forEach(img => {
                        const imgUrl = img.startsWith('http') ? img : `http://localhost:3000${img}`;
                        if (!images.includes(imgUrl)) {
                            images.push(imgUrl);
                        }
                    });
                }
                
                console.log('Product Images Array:', images); // Debug log
                
                setProductImages(images);
            } catch (error) {
                console.error('Error fetching product from API:', error);
                // Fallback to JSON data
                const foundProduct = productsData.find(p => p.id === parseInt(id));
                setProduct(foundProduct);
                if (foundProduct) {
                    const mainImg = foundProduct.img || foundProduct.image;
                    setSelectedImage(mainImg);
                    
                    const images = [mainImg];
                    if (foundProduct.hover && foundProduct.hover !== mainImg) {
                        images.push(foundProduct.hover);
                    }
                    setProductImages(images);
                }
            }
        };
        
        fetchProduct();
    }, [id]);

    if (!product) {
        return (
            <div className="products-view-container">
                <div className="products-view-right" style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#333', fontSize: '40px' }} />
                    <h2 style={{ color: '#333' }}>Product not found</h2>
                </div>
            </div>
        );
    }

    // Format price
    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + 'đ' : 'Contact for price';
    };

    // Calculate discount percentage
    const discountPercentage = product.originalPrice && product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleQuantityChange = (amount) => {
        setQuantity(prev => {
            const newQuantity = prev + amount;
            return newQuantity < 1 ? 1 : newQuantity;
        });
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="products-view-container">
            {/* Left Panel: Image & Details */}
            <div className="products-view-left">
                <div className="fixed-image-container">
                    <img 
                        src={selectedImage} 
                        alt={product.name} 
                        className="products-view-image"
                        onClick={toggleModal}
                        style={{ cursor: 'zoom-in' }}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                        }}
                    />
                </div>
                <div className="products-view-image-carsousel">
                    {productImages.length > 0 ? (
                        productImages.map((img, index) => (
                            <div 
                                key={index} 
                                className={`carousel-thumbnail ${selectedImage === img ? 'active' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            >
                                <img 
                                    src={img} 
                                    alt={`View ${index + 1}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                    }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="carousel-thumbnail active">
                            <img 
                                src={selectedImage || 'https://via.placeholder.com/80x80?text=No+Image'} 
                                alt="Main"
                            />
                        </div>
                    )}
                </div>

                {/* New Description and Detail Section */}
                <div className="product-left-details">
                    <div className="details-section">
                        <h3>DESCRIPTION</h3>
                        <p style={{ color: '#333'}}>{product.description}</p>
                    </div>
                    <div className="details-section">
                        <h3>DETAILS</h3>
                        <div className="detail-row">
                            <span className="detail-label">Category:</span>
                            <span className="detail-value">{product.category}</span>
                        </div>
                        {product.tag && (
                            <div className="detail-row">
                                <span className="detail-label">TAG:</span>
                                <span className="detail-value" style={{ textTransform: 'capitalize' }}>{product.tag}</span>
                            </div>
                        )}
                        {product.material && (
                            <div className="detail-row">
                                <span className="detail-label">Material:</span>
                                <span className="detail-value">{product.material}</span>
                            </div>
                        )}
                        {product.brand && (
                            <div className="detail-row">
                                <span className="detail-label">Brand:</span>
                                <span className="detail-value">{product.brand}</span>
                            </div>
                        )}
                        <div className="detail-row">
                            <span className="detail-label">SKU:</span>
                            <span className="detail-value">PS-{product.id.toString().padStart(4, '0')}</span>
                        </div>
                    </div>

                    {/* Size Guide Section */}
                    {categoryType && sizeChart[categoryType] && (
                        <div className="details-section">
                            <h3>SIZE GUIDE</h3>
                            <div className="size-chart-container">
                                <table className="size-chart-table">
                                    <thead>
                                        <tr>
                                            {sizeChart[categoryType].headers.map((h, i) => (
                                                <th key={i}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sizeChart[categoryType].rows.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => (
                                                    <td key={j}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="details-section">
                        <h3>SHIPPING & RETURNS</h3>
                        <div className="detail-row">
                            <span className="detail-label">Delivery:</span>
                            <span className="detail-value">2-4 Business Days</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Shipping:</span>
                            <span className="detail-value">Free on orders over 2M</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Returns:</span>
                            <span className="detail-value">30 Day Policy</span>
                        </div>
                    </div>

                    <div className="details-section">
                        <h3>CARE & WARRANTY</h3>
                        <p style={{fontSize: '13px', color: '#333'}}>
                            All Prime Souls products are backed by our quality guarantee. 
                            For best longevity, please follow care label instructions attached to the product.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Traits Grid */}
            <div className="products-view-right">
                
                {/* Row 1: ID/Header */}
                <div className="pv-header-row">
                    <div className="pv-label-col">
                        PRODUCT ID #{product.id}
                    </div>
                    <div className="pv-content-col">
                        <div className="keeper-number">{product.name}</div>
                    </div>
                </div>

                {/* Row 2: Traits */}
                <div className="pv-body-row">
                    <div className="pv-label-col">
                        <span className="bullet">■</span> TRAITS
                    </div>
                    <div className="pv-content-col" style={{ alignItems: 'flex-start', paddingTop: '40px',  }}>
                        <div className="traits-grid">
                            {/* Reviews Section replaces Category */}
                            <div className="trait-item">
                                <span className="trait-label">REVIEWS</span>
                                <div className="review-stars">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon key={i} icon={faStar} style={{ color: '#FFD700', marginRight: '2px' }} />
                                    ))}
                                    <span style={{ marginLeft: '8px', fontSize: '12px', fontWeight: 'bold' }}>(5.0)</span>
                                </div>
                            </div>
                            
                            {/* Size Selector - Conditional Rendering */}
                            {categoryType && sizeChart[categoryType] && (
                                <div className="trait-item" style={{ gridColumn: 'span 2' }}>
                                    <span className="trait-label">SIZE</span>
                                    <div className="size-selector">
                                        {sizeChart[categoryType].sizes.map((size) => (
                                            <button
                                                key={size}
                                                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Selector */}
                            <div className="trait-item" style={{ gridColumn: 'span 2' }}>
                                <span className="trait-label">COLOR</span>
                                <div className="color-selector">
                                    {colors.map((color) => (
                                        <button
                                            key={color.name}
                                            className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                                            style={{ backgroundColor: color.code }}
                                            onClick={() => setSelectedColor(color.name)}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Combined Price Section */}
                            <div className="trait-item" style={{ gridColumn: 'span 2' }}>
                                <span className="trait-label">PRICE</span>
                                <div className="price-container-view">
                                    {product.originalPrice && (
                                        <span className="original-price" style={{ 
                                            textDecoration: 'line-through', 
                                            color: '#999', 
                                            fontSize: '16px'
                                        }}>
                                            {formatPrice(product.originalPrice)}
                                        </span>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span className="trait-value" style={{ fontSize: '34px', color: '#BF1A1A'}}>
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.originalPrice && discountPercentage > 0 && (
                                            <span className="discount-tag-view" style={{
                                                backgroundColor: '#BF1A1A',
                                                color: '#fff',
                                                padding: '4px 8px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                borderRadius: '2px'
                                            }}>
                                                -{discountPercentage}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Row 3: Footer/Button */}
                <div className="pv-footer">
                    <div className="quantity-selector" style={{ marginRight: 'auto'}}>
                        <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
                        <span className="qty-value">{quantity}</span>
                        <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                    <button 
                        className="view-opensea-btn add-cart-btn"
                        onClick={() => {
                            // Logic to add to cart would go here
                            if (openCart) openCart();
                        }}
                    >
                        <span className="opensea-icon"><FontAwesomeIcon icon={faCartShopping} /></span>
                        ADD TO CART
                    </button>
                    <button className="view-opensea-btn buy-now-btn">
                        <span className="opensea-icon"><FontAwesomeIcon icon={faBolt} /></span>
                        BUY NOW
                    </button>
                </div>

            </div>

            {/* Image Modal Overlay */}
            {isModalOpen && (
                <div className="image-modal-overlay" onClick={toggleModal}>
                    <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="image-modal-close-wrapper" onClick={toggleModal}>
                            <button className="image-modal-close">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <img src={selectedImage} alt={product.name} className="modal-image" />
                    </div>
                </div>
            )}

            {/* You might also like section */}
        </div>
    );
}

export default ProductsView;
