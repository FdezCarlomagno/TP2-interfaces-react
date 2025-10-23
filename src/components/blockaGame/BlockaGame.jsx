import React, { useRef, useEffect, useState, useCallback } from "react";
import messiFace from "../../assets/imgs/messiFace.png";
import messiBlocka2 from "../../assets/imgs/messiBlocka2.jpg";
import messiBlocka3 from "../../assets/imgs/messiBlocka3.jpg";
import messiBlocka4 from "../../assets/imgs/messiBlocka4.jpg";
import messiBlocka5 from "../../assets/imgs/messiBlocka5.jpg";
import messiBlocka6 from "../../assets/imgs/messiBlocka6.jpg";
import { useNavigate } from "react-router-dom";
import "./BlockaGame.css";

export default function BlockaGame({ size = 260, initialLevel = 0, onExit }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [rotations, setRotations] = useState([0, 90, 180, 270]);
  const [level, setLevel] = useState(initialLevel);
  const [loaded, setLoaded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [imageSrc, setImageSrc] = useState(messiFace);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [uiHidden, setUiHidden] = useState(false);
  const devicePixelRatioRef = useRef(window.devicePixelRatio || 1);
  const [showLevelPreview, setShowLevelPreview] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [finalPreviewImage, setFinalPreviewImage] = useState(null);
  const nav = useNavigate()

  // 🆕 Nuevo estado para controlar cuándo mostrar la imagen sin filtro
  const [showCleanImage, setShowCleanImage] = useState(false);

  const [levelTimer, setLevelTimer] = useState({
    tiempo: 0,
    corriendo: false,
    intervalo: null
  });
  const [levelTimes, setLevelTimes] = useState({});

  const levelImages = [
    messiFace,
    messiBlocka2,
    messiBlocka3,
    messiBlocka4,
    messiBlocka5,
    messiBlocka6,
  ];

  const iniciarCronometro = useCallback(() => {
    if (levelTimer.corriendo) return;
    setLevelTimer(prev => ({ ...prev, corriendo: true, tiempo: 0 }));
    const intervalo = setInterval(() => {
      setLevelTimer(prev => ({ ...prev, tiempo: prev.tiempo + 10 }));
    }, 10);
    setLevelTimer(prev => ({ ...prev, intervalo }));
  }, [levelTimer.corriendo]);

  const detenerCronometro = useCallback(() => {
    if (levelTimer.intervalo) clearInterval(levelTimer.intervalo);
    setLevelTimer(prev => ({ ...prev, corriendo: false, intervalo: null }));
  }, [levelTimer.intervalo]);

  const formatearTiempo = useCallback((ms) => {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor((ms % 60000) / 1000);
    const centesimas = Math.floor((ms % 1000) / 10);
    return {
      minutos: minutos.toString().padStart(2, '0'),
      segundos: segundos.toString().padStart(2, '0'),
      centesimas: centesimas.toString().padStart(2, '0')
    };
  }, []);

  // 🎯 Animación de selección de imagen
  useEffect(() => {
    if (level >= 15) {
      setGameCompleted(true);
      detenerCronometro();
      setUiHidden(true);
      const timer = setTimeout(() => {
        setLevel(0);
        setGameCompleted(false);
        setIsCompleted(false);
        setLevelTimes({});
        setUiHidden(false);
        setShowCleanImage(false); // 🆕 Resetear estado de imagen limpia
      }, 3000);
      return () => clearTimeout(timer);
    }

    setShowLevelPreview(true);
    setUiHidden(true);
    setShowCleanImage(false); // 🆕 Asegurar que no se muestre limpia durante la preview

    let interval;
    let count = 0;
    interval = setInterval(() => {
      setSelectedImageIndex((prev) => (prev + 1) % levelImages.length);
      count++;
      if (count > 15) {
        clearInterval(interval);
        const randomIndex = Math.floor(Math.random() * levelImages.length);
        setSelectedImageIndex(randomIndex);
        setFinalPreviewImage(levelImages[randomIndex]);

        setTimeout(() => {
          setImageSrc(levelImages[randomIndex]);
          setFinalPreviewImage(null);
          setShowLevelPreview(false);
          setUiHidden(false);
          setRotations([0, 1, 2, 3].map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)]));
          setIsCompleted(false);
          setShowCleanImage(false); // 🆕 Asegurar que empiece con filtro
          iniciarCronometro();
        }, 1000);
      }
    }, 120);
  }, [level]);

  useEffect(() => {
    if (isCompleted && levelTimer.corriendo) {
      setLevelTimes(prev => ({ ...prev, [level]: levelTimer.tiempo }));
      detenerCronometro();
    }
  }, [isCompleted, levelTimer.corriendo, levelTimer.tiempo, level, detenerCronometro]);

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

    // 🆕 SOLUCIÓN: Solo aplicar filtro si NO está completado y NO se debe mostrar limpia
    if (level > 0 && !isCompleted && !showCleanImage) {
      const imageData = ctx.getImageData(0, 0, w, h);
      applyPixelFilter(imageData, level);
      ctx.putImageData(imageData, 0, 0);
    }
  }, [rotations, level, size, isCompleted, showCleanImage]); // 🆕 Agregar dependencias

  useEffect(() => {
    if (!loaded || isCompleted || gameCompleted) return;
    const completed = rotations.every((r) => Math.abs(r % 360) < 1);
    if (completed) handleLevelCompletion();
  }, [rotations, loaded, isCompleted, gameCompleted]);

  const handleLevelCompletion = useCallback(async () => {
    // 🔹 Marcar como completado
    setIsCompleted(true);
    
    // 🔹 Esperar un momento y luego mostrar la imagen limpia
    await new Promise(r => setTimeout(r, 500));
    
    // 🆕 MOSTRAR IMAGEN LIMPIA
    setShowCleanImage(true);
    
    // 🔹 Redibujar para quitar el filtro
    draw();
    
    // 🔹 Esperar 2 segundos mostrando la imagen limpia
    await new Promise(r => setTimeout(r, 2000));
    
    // 🔹 Pasar al siguiente nivel
    setLevel(lvl => lvl + 1);
  }, [draw]);

  useEffect(() => {
    if (loaded) draw();
  }, [rotations, level, draw, loaded, showCleanImage]); // 🆕 Agregar showCleanImage

  const getCanvasClassName = () => {
    let className = "blocka-canvas";
    if (isCompleted) className += " completed";
    if (gameCompleted) className += " game-finished";
    if (showLevelPreview || finalPreviewImage) className += " hidden";
    return className;
  };

  const handleResetGame = () => {
    setLevel(0)
  }

  const handleExitGame = () => {
    onExit()
  }

  const handleAyuda = () => {
    if (gameCompleted || isCompleted) return;

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.classList.add("help-flash");
      setTimeout(() => canvas.classList.remove("help-flash"), 800);
    }

    setLevelTimer(prev => ({ ...prev, tiempo: prev.tiempo + 5000 }));

    setRotations(prev => {
      const incorrectIndexes = prev
        .map((r, i) => (r % 360 !== 0 ? i : null))
        .filter(i => i !== null);

      if (incorrectIndexes.length === 0) return prev;

      const randomIndex = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
      const next = [...prev];
      next[randomIndex] = 0;

      return next;
    });
  };

  const handleCloseInstructions = () => {
    setUiHidden(false)
    setShowInstructions(false)
  }

  const handleShowInstructions = () => {
    setUiHidden(true)
    setShowInstructions(true)
  }

  const tiempoDisplay = formatearTiempo(levelTimer.tiempo);

  return (
    <div className="blocka-container">
      <button className="close-game reset"
        hidden={uiHidden}
        onClick={handleResetGame}
        disabled={level == 0}
      >Reiniciar</button>
      <button className="close-game"
        hidden={uiHidden}
        onClick={handleExitGame}
      >Salir</button>
      <div className="blocka-game">
        <div className={`blocka-timer ${uiHidden && "hidden"}`}>
          <div className="timer-display">
            {tiempoDisplay.minutos}:{tiempoDisplay.segundos}.{tiempoDisplay.centesimas}
          </div>
        </div>
        {showLevelPreview && (
          <div className="blocka-preview">
            {levelImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`preview-thumb ${selectedImageIndex === index ? "active" : ""}`}
              />
            ))}
          </div>
        )}

        {finalPreviewImage && (
          <div className="final-preview-image-container">
            <img
              src={finalPreviewImage}
              alt="Selected preview"
              className="final-preview-image"
            />
          </div>
        )}

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
              <h3>🧩 Cómo jugar Blocka Messi</h3>
              <ul>
                <li>Haz <strong>clic izquierdo</strong> sobre un cuadrante para girarlo 90° a la derecha.</li>
                <li>Haz <strong>clic derecho</strong> para girarlo a la izquierda.</li>
                <li>Tu objetivo es <strong>armar correctamente</strong> la imagen de Messi.</li>
                <li>Usa el botón <strong>🔍 Ayuda</strong> si te atascas (¡pero agrega +5 segundos!).</li>
                <li>Completa todos los niveles lo más rápido posible.</li>
              </ul>
              <button className="instructions-close" onClick={handleCloseInstructions}>
                ✖ Cerrar
              </button>
            </div>
          </div>
        )}

      </div>

      {isCompleted && !gameCompleted && (
        <div className="blocka-win" hidden={showLevelPreview}>
          ¡Nivel completado! 🎉
          <div className="level-time">
            Tiempo: {formatearTiempo(levelTimes[level] || 0).minutos}:
            {formatearTiempo(levelTimes[level] || 0).segundos}.
            {formatearTiempo(levelTimes[level] || 0).centesimas}
          </div>
        </div>
      )}

      {gameCompleted && (
        <div className="blocka-final">
          ¡Juego completado! 🏆 Reiniciando...
          <div className="total-time">
            Tiempo total: {formatearTiempo(
              Object.values(levelTimes).reduce((acc, time) => acc + time, 0)
            ).minutos}:
            {formatearTiempo(
              Object.values(levelTimes).reduce((acc, time) => acc + time, 0)
            ).segundos}
          </div>
        </div>
      )}

      <div className={`blocka-controls ${uiHidden && "hidden"}`}>
        <button
          onClick={handleAyuda}
          disabled={gameCompleted}
        >
          🔍 Ayuda
        </button>
        <span className="blocka-level">Nivel: {level}</span>
        <button onClick={handleShowInstructions}>❔ Instrucciones</button>
      </div>
    </div>
  );
}