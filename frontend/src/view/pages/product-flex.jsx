import "./pages-style/product-flex.css";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import productsData from "../data/products.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

function ProductFlex() {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // Filter products 1-7 for the carousel (keeping original logic)
    const products = productsData.filter(p => p.id <= 7);

    const scrollLeft = () => {
        if (containerRef.current) {
            const scrollAmount = containerRef.current.clientWidth / 4;
            containerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            const scrollAmount = containerRef.current.clientWidth / 4;
            containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };
    
    return (
        <div className="product-flex">
            <h1 className="product-flex-title"><FontAwesomeIcon icon={faSquare} style={{ fontSize: '30px' }}/> FEATURED</h1>
            <div className="product-flex-wrapper">
                <button className="scroll-btn scroll-btn-left" onClick={scrollLeft}>
                    &#8249;
                </button>
                <div 
                    className="product-flex-container"
                    ref={containerRef}
                >
                    {products.map((product, index) => (
                        <div key={product.id} className={`product-flex-item item${index + 1}`}>
                            <div className="hover-background">
                                <img src={product.hover} alt="Hover Background" className="hoverbgimg"/>
                            </div>
                            <h3 className="product-flex-name">{product.name}</h3>
                            <img src={product.img} alt={product.name} className="modelimg" style={product.style || {}}/>
                            <Link to={product.link} className="shop-now-btn">
                                <div>SHOP NOW</div>
                            </Link>
                        </div>
                    ))}
                </div>
            <button className="scroll-btn scroll-btn-right" onClick={scrollRight}>
                &#8250;
            </button>
        </div>
        </div>
    );
}

export default ProductFlex;