import "/src/view/pages/pages-style/slogan.css";
import one from "/src/assets/image/1.png";
import two from "/src/assets/image/2.png";
import three from "/src/assets/image/3.jpg";
import four from "/src/assets/image/4.jpg";
import five from "/src/assets/image/5.jpg";
import six from "/src/assets/image/6.jpg";
import seven from "/src/assets/image/7.jpg";
import eight from "/src/assets/image/8.jpg";

function Slogan() {
  const images = [one, two, three, four, five, six, seven, eight];

  // thời gian hiển thị mỗi ảnh và tổng thời gian của toàn bộ chu trình ảnh
  const slideDuration = 4; // 4s mỗi ảnh
  const totalDuration = images.length * slideDuration; // tổng thời gian = số ảnh * thời gian mỗi ảnh

  return (
    <>
      <div className="slogan-container">
        <div className="slogan-image">
          <div className="slideshow" aria-hidden="false">
            {images.map((src, i) => ( // Lặp qua mảng images để tạo các phần tử src để hiển thị ảnh, i là chỉ số của ảnh trong mảng
              <img
                key={i} //Key i để React theo dõi các phần tử trong danh sách
                src={src} // Lặp lai mảng images bằng src để hiển thị ảnh
                alt={`Slide ${i + 1}`}  // Văn bản thay thế cho ảnh, hiển thị số thứ tự của ảnh
                className="slide"
                style={{
                  animationDelay: `${i * slideDuration}s`,  // Đặt độ trễ cho mỗi ảnh dựa trên chỉ số i và thời gian hiển thị mỗi ảnh
                  animationDuration: `${totalDuration}s`, // Đặt tổng thời gian của toàn bộ chu trình ảnh
                }}
              />
            ))}
          </div>
        </div>

        <div className="slogan-main">
          <p>Move with Soul. Live in Prime.</p>
        </div>
        <div className="slogan-shape">
          <div className="shape-shape1">
            <h1 className="shape-title1">
              <span className="shape-word">||||||||MOVE</span>
              <span className="shape-word">||||||||WITH</span>
              <span className="shape-word">||||||||SOUL</span>
            </h1>
          </div>
          <div className="shape-shape2">
            <h1 className="shape-title2">
              <span className="shape-word">LIVE||||||||</span>
              <span className="shape-word">WITH||||||||</span>
              <span className="shape-word">PRIME||||||||</span>
            </h1>
          </div>
        </div>
        
      </div>
    </>
  );
}

export default Slogan;