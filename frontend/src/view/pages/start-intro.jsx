import { useEffect, useState } from "react";
import pslogo from "/src/assets/image/3d-logo.png";
import "/src/view/pages/pages-style/start-intro.css";

/*
  Component: StartupLoader
  - duration: thời gian (ms) loader hiển thị mặc định
  Mục đích: hiển thị logo khởi động, gõ logo brands "Prime Souls", rồi ẩn loader.
*/
export default function StartupLoader({ duration = 1100 }) {
  // Hiển thị logo khi component mount
  const [visible, setVisible] = useState(true);
  // Trạng thái đang ẩn (dùng cho animation trước khi ẩn hẳn)
  const [hiding, setHiding] = useState(false);

  // Trạng thái gõ chữ
  const fullText = "Prime Souls";
  const [typed, setTyped] = useState("");

  // Bắt đầu hiệu ứng gõ chữ sau khi component mount
  // - startDelay: delay trước khi bắt đầu gõ
  // - charDelay: thời gian giữa các ký tự
  useEffect(() => {
    const startDelay = 150; // ms trước khi bắt đầu gõ
    const charDelay = 50; // ms giữa mỗi ký tự
    let timeoutStart = null;
    let interval = null;

    timeoutStart = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i += 1;
        setTyped(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(interval);
        }
      }, charDelay);
    }, startDelay);

    // Cleanup khi unmount hoặc re-run
    return () => {
      clearTimeout(timeoutStart);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Sau khi logo và chữ xuất hiện, bắt đầu ẩn dần theo duration
  useEffect(() => {
    // setHiding trước một chút để cho animation "fade out"
    const t = setTimeout(() => setHiding(true), duration - 300);
    // sau duration sẽ ẩn hoàn toàn component
    const t2 = setTimeout(() => setVisible(false), duration);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [duration]);

  // Nếu không còn visible thì không render gì
  if (!visible) return null;

  return (
    <div className={`loader-overlay ${hiding ? "hide" : "show"}`} aria-hidden={!visible}>
      <div className="loader" >
        <img src={pslogo} alt="Logo" className="loader-logo" />
        <p className={`loader-title ${typed === fullText ? "done" : "typing"}`}>
          {typed}
          <span className="caret" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}