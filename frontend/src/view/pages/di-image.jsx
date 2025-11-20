import "./pages-style/di-image.css";
import first from "/src/assets/image/run-orange.png";
import firstremovebg from "/src/assets/image/run-orange-Photoroom.png";
import second from "/src/assets/image/blue-rail.png";
function DiImage() {
    return (
        <div className="di-image-container">
            <div className="di-image-slogan">
                <h1 style={{ color: 'white' }}>PRIME</h1>
                <h1 style={{ color: '#D0FE1D' }}>SOULS</h1>
            </div>
            <div className="di-image-text">

            </div>
            <div className="di-image-content">
                <div className="di-image-first-wrapper">
                    <img src={first} alt="diImage" className="di-image-first" />
                    <img src={firstremovebg} alt="diImage" className="di-image-first-overlay" />
                </div>
                <img src={second} alt="diImage" className="di-image-second" />
            </div>
        </div>
    )
}

export default DiImage;