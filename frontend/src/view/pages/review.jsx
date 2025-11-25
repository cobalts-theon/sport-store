import "./pages-style/review.css";
import soccerimg from "/src/assets/image/Soccer.jpg";
import transparentimgaa from "/src/assets/image/transparent-Photoroom.png";
import shoe from "/src/assets/image/shoe.png";
import topolanding from "/src/assets/video/topo-landing.webm";
import degrees from "/src/assets/icon/degrees.svg";
import lime from "/src/assets/image/limes-logo-Photoroom.png";
import calloutlineup from "/src/assets/icon/calloutlineup.svg";
import calloutlinedown from "/src/assets/icon/calloutlinedown.svg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare, faFutbol ,faInfo} from '@fortawesome/free-solid-svg-icons';
function Review() {
    const ringText = " PRIME SOULS • PRIME SOULS • PRIME SOULS • "; // Chuỗi văn bản lặp lại 3 lần

    return (
        <div className="review-container-bento-grid">
            <div className="review-container-bento-grid-title" id="title" style={{ color: 'white' }}>
                <h1><FontAwesomeIcon icon={faSquare} style={{ fontSize: '30px' }}/> ABOUT OUR PRODUCT</h1>
            </div>
            <div className="review-container-bento-grid-item" id="box-1">
                <div className="lime-ring-container">
                    <svg className="lime-ring-text" viewBox="0 0 200 200" aria-hidden="true">
                        <defs>
                            <path id="lime-text-circle" d="M100,10 a90,90 0 1,1 -0.01,0" />
                        </defs>
                        <text>
                            <textPath xlinkHref="#lime-text-circle" startOffset="0%">
                                {ringText.repeat(3)}
                            </textPath>
                        </text>
                    </svg>
                    <img src={lime} alt="Lime" className="lime-img"/>
                </div>
                <img src={soccerimg} alt="Soccer" />
                <img src={transparentimgaa} alt="Transparent" className="removebg-img123" />
                <h2 className="white-lime-text" >Zinedine Zidane <FontAwesomeIcon icon={faFutbol} /></h2>
            </div>
            <div className="review-container-bento-grid-item" id="box-2">
                <img src={shoe} alt="Shoe" className="shoe-img" />
                <p className="product-name2"><FontAwesomeIcon icon={faSquare} />PS LXCX Trainer</p>
                <img src={calloutlineup} alt="Calloutlineup" className="calloutlineup-img" />
                <img src={calloutlinedown} alt="Calloutlinedown" className="calloutlinedown-img" />
                <p className="product-material">Cotton</p>
                <p className="product-material1-des"><FontAwesomeIcon icon={faSquare} /> Shoelaces made from 100% cotton, making them soft and comfortable to wear.</p>
                <p className="product-material2">Rubber</p>
                <p className="product-material2-des">The rubber sole provides excellent grip and durability, making it perfect for outdoor activities.<FontAwesomeIcon icon={faSquare} /> </p>
            </div>
            <div className="review-container-bento-grid-item" id="box-3">
                <p className="coordinates">N 15°58'31.4<br></br> E 108°15'11.9</p>
                <video src={topolanding} alt="Topo Landing" autoPlay muted loop />
                <img src={degrees} alt="Degrees" />
            </div>
            <div className="review-container-bento-grid-item" id="box-4">
                <h1 style={{ color: 'white' }}>Welcome to <span style={{ color: '#D0FE1D' }}>PRIME SOULS</span> – your trusted destination for high-quality sports gear and apparel, empowering you to push your limits and elevate your active lifestyle.</h1>
                <p style={{ color: 'white' }}><FontAwesomeIcon icon={faSquare} /> The Best Choice for Your Sports Gear</p>
            </div>
        </div>
    );
}

export default Review;