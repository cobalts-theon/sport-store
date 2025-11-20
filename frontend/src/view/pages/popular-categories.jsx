import "./pages-style/popular-categories.css";
import productsData from "../data/products.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare } from "@fortawesome/free-solid-svg-icons";

function PopularCategories() {
    // Filter products 1-8 for display
    const products = productsData.filter(p => p.id <= 8);

    return (
        <div className="popular-categories">
            <h1 className="popular-categories-title">
                <FontAwesomeIcon icon={faSquare} style={{ fontSize: '30px' }}/> POPULAR CATEGORIES
            </h1>
            <div className="popular-categories-container">
                {products.map((product, index) => (
                    <div key={product.id} className={`popular-categories-item item${index + 1}`}>
                        <h3 className="popular-categories-name">{product.name}</h3>
                        <img src={product.img} alt={product.name} className="modelimg" style={product.style || {}}/>
                        <a href={product.link} className="shop-now-btn">
                            <div>SHOP NOW</div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PopularCategories;

