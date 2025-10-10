import "/src/view/pages/pages-style/home.css";
import limelogo from "/src/assets/image/limes-logo-Photoroom.png";

function Home() {
  const ringText = " PRIME SOULS • PRIME SOULS • PRIME SOULS • ";

  return (
    <>
      <div className="home-container">
        <div className="home-image">
          <img src={limelogo} alt="Home Banner" />
          <svg className="ring-text" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <path id="text-circle" d="M100,10 a90,90 0 1,1 -0.01,0" />
            </defs>
            <text>
              <textPath xlinkHref="#text-circle" startOffset="0%">
                {ringText.repeat(3)}
              </textPath>
            </text>
          </svg>
        </div>

        <div className="home-solgan">
          <p>Move with Soul. Live in Prime.</p>
        </div>
      </div>
    </>
  );
}

export default Home;