import "./components-style/infbar.css";
import soccer from "/src/assets/icon/fudball.svg";
import volleyball from "/src/assets/icon/volleyball.svg";
import shoe from "/src/assets/icon/shoe.svg";
import bottle from "/src/assets/icon/bottle.svg";
import tanktop from "/src/assets/icon/tanktop.svg";
import basketball from "/src/assets/icon/basketball.svg";
import cup from "/src/assets/icon/cup.svg";
import baseball from "/src/assets/icon/baseball.svg";
import tennis from "/src/assets/icon/tennis.svg";
import dumbbell from "/src/assets/icon/dumbbell.svg";
import tabletennis from "/src/assets/icon/tabletennis.svg";
function Infbar() {
  // Tăng số lượng logo để đảm bảo không bao giờ bị thiếu
  const logos = Array(30).fill(null); 
  const manylogos = [soccer, shoe, volleyball, bottle, basketball, tanktop, cup, baseball, tennis, dumbbell, tabletennis];

  return (
    <div className="infbar-container">
      <div className="infbar-track">
        {/* Dãy logo 1 */}
        {logos.map((_, index) => (
          <img 
            key={`logo-a-${index}`} /* Key duy nhất */
            src={manylogos[index % manylogos.length]}   /* Lặp lai mảng manylogos */
            alt="Scrolling Logo" 
            className="infbar-logo" 
          />
        ))}
        {/* Dãy logo 2 (bản sao để lặp lại) */}
        {logos.map((_, index) => (
          <img 
            key={`logo-b-${index}`} /* Key duy nhất */
            src={manylogos[index % manylogos.length]} 
            alt="Scrolling Logo" 
            className="infbar-logo" 
          />
        ))}
      </div>
    </div>
  );
}

export default Infbar;