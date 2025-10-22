import React, { useRef, useEffect, useState, useCallback } from "react";
import messiFace from "../../assets/imgs/messiFace.png";
import messiBlocka2 from "../../assets/imgs/messiBlocka2.jpg";
import messiBlocka3 from "../../assets/imgs/messiBlocka3.jpg";
import messiBlocka4 from "../../assets/imgs/messiBlocka4.jpg";
import messiBlocka5 from "../../assets/imgs/messiBlocka5.jpg";
import messiBlocka6 from "../../assets/imgs/messiBlocka6.jpg";
import "./BlockaGame.css";

export default function BlockaGame({ size = 240, initialLevel = 0 }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [rotations, setRotations] = useState([0, 90, 180, 270]);
  const [level, setLevel] = useState(initialLevel);
  const [loaded, setLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageSrc, setImageSrc] = useState(messiFace);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const devicePixelRatioRef = useRef(window.devicePixelRatio || 1);

  const levelImages = [
    messiFace,
    messiBlocka2,
    messiBlocka3,
    messiBlocka4,
    messiBlocka5,
    messiBlocka6,
  ];

  // Efecto para cambiar de nivel y reiniciar el juego
  useEffect(() => {
    if (level >= 100) {
      setGameCompleted(true);
      const timer = setTimeout(() => {
        setLevel(0);
        setGameCompleted(false);
        setIsCompleted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    const imgForLevel = levelImages[level % levelImages.length];
    setImageSrc(imgForLevel);
    // Resetear rotaciones y estado de completado al cambiar de nivel
    setRotations(() =>
      [0, 1, 2, 3].map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
    );
    setIsCompleted(false);
  }, [level]);

  // Efecto para cargar la imagen
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc && imageSrc.default ? imageSrc.default : imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
      draw();
    };
  }, [imageSrc]);

  const getQuadrant = (x, y, w, h) => {
    const mx = w / 2;
    const my = h / 2;
    if (x < mx && y < my) return 0;
    if (x >= mx && y < my) return 1;
    if (x < mx && y >= my) return 2;
    return 3;
  };

  const rotateQuadrant = useCallback((index, delta) => {
    setRotations((prev) => {
      const next = [...prev];
      next[index] = ((next[index] + delta) % 360 + 360) % 360;
      return next;
    });
  }, []);

  // Efecto para los controles del mouse
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e) => {
      if (showInstructions || isCompleted || gameCompleted) return;

      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
      const y = ((e.clientY - rect.top) * canvas.height) / rect.height;
      const quadrant = getQuadrant(x, y, canvas.width, canvas.height);

      if (e.button === 0) rotateQuadrant(quadrant, 90);
      else if (e.button === 2) rotateQuadrant(quadrant, -90);
    };

    const onContext = (ev) => ev.preventDefault();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("contextmenu", onContext);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("contextmenu", onContext);
    };
  }, [rotateQuadrant, showInstructions, isCompleted, gameCompleted]);

  // --- FILTROS PIXEL A PIXEL ---
  const applyPixelFilter = (imageData, lvl) => {
    const data = imageData.data;
    const len = data.length;

    const grayscale = (i) => {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    };
    const invert = (i) => {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    };
    const posterize = (i, steps = 4) => {
      const f = 255 / (steps - 1);
      data[i] = Math.round(data[i] / f) * f;
      data[i + 1] = Math.round(data[i + 1] / f) * f;
      data[i + 2] = Math.round(data[i + 2] / f) * f;
    };

    if (lvl === 0) return;
    if (lvl % 6 === 1) for (let i = 0; i < len; i += 4) grayscale(i);
    if (lvl % 6 === 2) for (let i = 0; i < len; i += 4) invert(i);
    if (lvl % 6 === 3) for (let i = 0; i < len; i += 4) posterize(i, 3);
    if (lvl % 6 === 4)
      for (let i = 0; i < len; i += 4) {
        data[i] *= 0.8;
        data[i + 1] *= 0.9;
      }
    if (lvl % 6 === 5)
      for (let i = 0; i < len; i += 4) {
        data[i + 2] = Math.min(255, data[i + 2] + 40);
      }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    const dpr = devicePixelRatioRef.current;
    const w = size;
    const h = size;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;
    const cellW = w / 2;
    const cellH = h / 2;
    const srcCellW = side / 2;
    const srcCellH = side / 2;

    const quadrants = [
      { sx, sy, dx: 0, dy: 0 },
      { sx: sx + srcCellW, sy, dx: cellW, dy: 0 },
      { sx, sy: sy + srcCellH, dx: 0, dy: cellH },
      { sx: sx + srcCellW, sy: sy + srcCellH, dx: cellW, dy: cellH },
    ];

    quadrants.forEach((q, idx) => {
      const rot = (rotations[idx] || 0) * (Math.PI / 180);
      const cx = q.dx + cellW / 2;
      const cy = q.dy + cellH / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.drawImage(img, q.sx, q.sy, srcCellW, srcCellH, -cellW / 2, -cellH / 2, cellW, cellH);
      ctx.restore();
    });

    if (level > 0) {
      const imageData = ctx.getImageData(0, 0, w, h);
      applyPixelFilter(imageData, level);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [rotations, level, size]);

  // Efecto para verificar victoria - CORREGIDO
  useEffect(() => {
    if (!loaded || isCompleted || gameCompleted) return;

    const completed = rotations.every((r) => Math.abs(r % 360) < 1);

    if (completed) {
      console.log("¡Nivel completado!");
      handleLevelCompletion();
    }
  }, [rotations, loaded, isCompleted, gameCompleted]);

  const handleLevelCompletion = useCallback(async () => {
    setIsCompleted(true);
    await sleep(2000); // Pausa de 500ms
    console.log("Pasando al siguiente nivel");
    setLevel((lvl) => lvl + 1);
  }, []);

  // Función sleep helper
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Efecto para dibujar - SEPARADO de la lógica de victoria
  useEffect(() => {
    if (loaded) {
      draw();
    }
  }, [rotations, level, draw, loaded]);

  // Determinar clases CSS para el canvas
  const getCanvasClassName = () => {
    let className = "blocka-canvas";
    if (isCompleted) className += " completed";
    if (gameCompleted) className += " game-finished";
    return className;
  };

  return (
    <div className="blocka-container">
      <div className="blocka-game">
        <canvas
          ref={canvasRef}
          className={getCanvasClassName()}
          width={size}
          height={size}
          onContextMenu={(e) => e.preventDefault()}
        />

        {showInstructions && (
          <div className="blocka-instructions-overlay" onClick={() => setShowInstructions(false)}>
            <div className="blocka-instructions" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setShowInstructions(false)}>✖</button>
              <h3>🧩 Cómo jugar</h3>
              <p>
                Blocka Game es un juego de lógica y observación donde tenés que reconstruir una
                imagen a partir de 4 piezas rotables.
                A medida que avanzás, cada nivel aplica nuevos filtros
                visuales (blanco y negro, inversión, posterización, etc.) para hacerlo más difícil.
              </p>
              <ul>
                <li>🖱️ Click izquierdo: rota +90°</li>
                <li>🖱️ Click derecho: rota -90°</li>
                <li>🎯 Completá la imagen para pasar de nivel</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Mensajes de estado */}
      {isCompleted && !gameCompleted && (
        <div className="blocka-win">¡Nivel completado! 🎉</div>
      )}

      {gameCompleted && (
        <div className="blocka-final">¡Juego completado! 🏆 Reiniciando...</div>
      )}

      <div className="blocka-controls">
        <button
          onClick={() => {
            setRotations([0, 1, 2, 3].map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)]));
            setIsCompleted(false);
          }}
          disabled={gameCompleted}
        >
          🔀 Mezclar
        </button>
        <button
          onClick={() => setLevel((v) => Math.max(0, v - 1))}
          disabled={gameCompleted}
        >
          ⬇ Nivel -
        </button>
        <span className="blocka-level">Nivel: {level}</span>
        <button
          onClick={() => setLevel((v) => Math.min(100, v + 1))}
          disabled={gameCompleted}
        >
          ⬆ Nivel +
        </button>
        <button onClick={() => setShowInstructions(true)}>❔ Instrucciones</button>
      </div>
    </div>
  );
}