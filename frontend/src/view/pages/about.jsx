import "./pages-style/about.css";
import { FaSquare } from "react-icons/fa6";
import image1 from "/src/assets/image/about1.png";
import image2 from "/src/assets/image/about2.png";
import whitelogo from "/src/assets/image/white-logo.png";
import basketball from "/src/assets/image/basketball.png";
import shoes from "/src/assets/image/shoe.png";
import pickle from "/src/assets/image/pickle-rmg.png";
import volleyball from "/src/assets/image/volleyball.png";
import blueorange from "/src/assets/image/blue-orange.png";
import waterbottle from "/src/assets/image/waterbottle(orange).png";
import football from "/src/assets/image/Football.png";
import soccer from "/src/assets/image/Soccer-Photoroom.png";
import shorts from "/src/assets/image/Short.png";
import glitchfootball from "/src/assets/image/football(glitch).png";

function About() {
    return (
        <div className="about-container">
            <div className="about-container-content">
                <p><FaSquare/> Prime Souls is</p>
                <h1> the brand built by athletes, for athletes who refuse to be average. Real gear, born in the grind, made to keep up when you’re giving everything. No excuses. Just Prime.</h1>
            </div>
            <div className="about-container-image">
                <img src={image1} alt="About" />
                <img src={image2} alt="About" />
                <img src={whitelogo} alt="About" />
            </div>
            <div className="what-about-us">
                <p>//What's Prime Soulsabout?</p>
                <h2><span style={{ color: '#D0FE1D' }}>Prime Souls</span> is a brand made by a student with big dreams and bigger hustle. <br></br>It's about buying and managing your own sports products.</h2>
            </div>
            <div className="why-choose-us">
                <h2>Why choose <span style={{ color: '#D0FE1D' }}>Prime Souls</span>?</h2>
                <p>Quality that punches way above its price: same performance fabrics as the big names, but without the markup.</p>
                <img src={basketball} alt="basketball" id="basketball"/>
                <h2>And the best part?</h2>
                <p>You can buy and sell your own products to other athletes.</p>
                <img src={shoes} alt="shoes" id="shoes"/>
                
                {/* 8 Floating Images */}
                <img src={pickle} className="float-item item-1" alt="pickleball" />
                <img src={volleyball} className="float-item item-2" alt="volleyball" />
                <img src={blueorange} className="float-item item-3" alt="shoe" />
                <img src={waterbottle} className="float-item item-4" alt="bottle" />
                <img src={football} className="float-item item-5" alt="football" />
                <img src={soccer} className="float-item item-6" alt="soccer" />
                <img src={shorts} className="float-item item-7" alt="shorts" />
                <img src={glitchfootball} className="float-item item-8" alt="glitchfootball" />
            </div>
        </div>
    )
}

export default About;