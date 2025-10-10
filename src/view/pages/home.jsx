import "/src/view/pages/pages-style/home.css";
import limelogo from "/src/assets/image/limes-logo-Photoroom.png";

function Home() {
  const ringText = " PRIME SOULS • PRIME SOULS • PRIME SOULS • "; //Khai báo chuỗi văn bản để lặp lại trong vòng tròn

  // Hàm này sẽ tạo ra một vòng tròn văn bản xung quanh hình ảnh
  // và lặp lại chuỗi văn bản đã khai báo

  return (
    <>
      <div className="home-container">
        <div className="home-image">
          <img src={limelogo} alt="Home Banner" />
          <svg className="ring-text" viewBox="0 0 200 200" aria-hidden="true"> {/* Vòng tròn văn bản trang trí */}
            <defs>
              <path id="text-circle" d="M100,10 a90,90 0 1,1 -0.01,0" />
            </defs>
            <text>
              <textPath xlinkHref="#text-circle" startOffset="0%">  
                {ringText.repeat(3)}  {/* repeat(3) Lặp lại chuỗi văn bản 3 để tạo hiệu ứng vòng tròn */}
              </textPath>
            </text>
          </svg>
        </div>

        <div className="home-solgan">
          <p>Move with Soul. Live in Prime.</p>
        </div>
        <div className="infinite-scroll-image">
          {/* <div className="scrolling-images">
            <img src={limelogo} alt="Scrolling Logo" />
            <img src={limelogo} alt="Scrolling Logo" />
            <img src={limelogo} alt="Scrolling Logo" />
            <img src={limelogo} alt="Scrolling Logo" />
          </div> */}
        </div>
      </div>
    </>
  );
}

export default Home;