
import React, { useEffect } from 'react';

const Cursor: React.FC = () => {
  useEffect(() => {
    const ring = document.getElementById("cursor-ring");
    const dot = document.getElementById("cursor-dot");

    if (!ring || !dot) return;

    let hideTimer: number;

    const move = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      ring.style.left = x + "px";
      ring.style.top = y + "px";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      ring.classList.remove("cursor-hide");
      dot.classList.remove("cursor-hide");
      clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        ring.classList.add("cursor-hide");
        dot.classList.add("cursor-hide");
      }, 2000);
    };

    const mouseDown = () => {
      ring.style.width = "34px";
      ring.style.height = "34px";
    };

    const mouseUp = () => {
      ring.style.width = "22px";
      ring.style.height = "22px";
    };
    
    const mouseLeave = () => {
        ring.classList.add("cursor-hide");
        dot.classList.add("cursor-hide");
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    window.addEventListener("mouseleave", mouseLeave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      window.removeEventListener("mouseleave", mouseLeave);
      clearTimeout(hideTimer);
    };
  }, []);

  return null; // This component doesn't render anything itself
};

export default Cursor;
