import { useEffect, useState } from "react";
import pslogo from "/src/assets/image/3d-logo.png";
import "/src/view/pages/pages-style/start-intro.css";

export default function StartupLoader({ duration = 1100 }) {
  //Make logo visible and not hidding at start 
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  // typing state
  const fullText = "Prime Souls";
  const [typed, setTyped] = useState("");

  // start typing shortly after mount (after logo appears)
  useEffect(() => {
    const startDelay = 150; // milisecond(ms) before typing starts
    const charDelay = 50; // ms per character
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

    return () => {
      clearTimeout(timeoutStart);
      if (interval) clearInterval(interval);
    };
  }, []);

  //After logo apear and logo name apear 
  useEffect(() => {
    const t = setTimeout(() => setHiding(true), duration - 300);
    const t2 = setTimeout(() => setVisible(false), duration);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [duration]);

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