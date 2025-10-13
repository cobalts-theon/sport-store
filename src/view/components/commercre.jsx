import "./components-style/commercre.css";
import sales from "/src/assets/icon/sales.svg";

function Commercre() {
    const logos = Array(30).fill(null); 
    const word = [ {text: "CHAMPION'S PRIVILEGE: SALE UP TO 10% OFF", icon: sales},
    {text: "MEGA SALE EVENT", icon: sales},
    ];
    return (<>
        <div className="commercre-container">
            <div className="commercre-track">
                {/* Dãy chữ 1 */}
                {logos.map((_, index) => (
                    <div 
                        key={`word-a-${index}`} /* Key duy nhất */
                        className="infbar-word"
                    >
                        <img src={word[index % word.length].icon} alt="sale icon" className="infbar-icon" />
                        {word[index % word.length].text}
                    </div>
                ))}
                {/* Dãy chữ 2 (bản sao để lặp lại) */}
                {logos.map((_, index) => (
                    <div 
                        key={`word-b-${index}`} /* Key duy nhất */
                        className="infbar-word"
                    >
                        <img src={word[index % word.length].icon} alt="sale icon" className="infbar-icon" />
                        {word[index % word.length].text}
                    </div>
                ))}
            </div>
        </div>
    </>
    )
}

export default Commercre;