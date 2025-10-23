// components/Sombra.jsx
import { useEffect } from "react";

export default function Sombra({
  id = "sombra-bg-style",
  className = "has-sombra-bg",
  size = "20vmax",
  pos = "50% 50%",
  blur = "250px",
  opacity = 0.8,
  color = "#FF1C8A",
  side = "left", // "left" o "right"
  offset = "0px"  // distancia desde el borde
} = {}) {
  useEffect(() => {
    // remover estilo previo
    const prev = document.getElementById(id);
    if (prev) prev.remove();

    const style = document.createElement("style");
    style.id = id;
    style.type = "text/css";

    const horizontalPosition = side === "left" ? `left: ${offset};` : `right: ${offset};`;

    style.innerHTML = `
      body.${className}::before {
        content: "";
        position: fixed;
        top: 0;
        ${horizontalPosition}
        width: ${size};
        height: ${size};
        pointer-events: none;
        z-index: -1;
        background: radial-gradient(circle at ${pos}, ${color} ${opacity * 100}%, transparent 85%);
        filter: blur(${blur});
        mix-blend-mode: screen;
      }
    `;

    document.head.appendChild(style);
    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [id, className, size, pos, blur, opacity, color, side, offset]);

  return null;
}
