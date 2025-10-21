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
  const devicePixelRatioRef = useRef(window.devicePixelRatio || 1);

  const levelImages = [
    messiFace,
    messiBlocka2,
    messiBlocka3,
    messiBlocka4,
    messiBlocka5,
    messiBlocka6,
  ];

  // when level changes, pick image and reshuffle pieces
  useEffect(() => {
    const imgForLevel = levelImages[level % levelImages.length];
    setImageSrc(imgForLevel);

    // reshuffle rotations for the new level
    setRotations(() =>
      [0, 1, 2, 3].map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  // load current image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc && imageSrc.default ? imageSrc.default : imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
      draw(); // initial draw once loaded
    };
    img.onerror = (err) => {
      console.error("BlockaGame: image failed to load:", imageSrc, err);
      setLoaded(false);
    };
  }, [imageSrc]);

  // helpers
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (n) => Math.floor(Math.random() * n);

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

  // pointer handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onPointerDown = (e) => {
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
  }, [rotateQuadrant]);

  // pixel filters (mutates imageData.data)
  const applyPixelFilter = (imageData, lvl) => {
    const data = imageData.data;
    const len = data.length;

    // helpers inside to keep code tidy
    const grayscaleAt = (i) => {
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = data[i + 1] = data[i + 2] = lum;
    };

    const invertAt = (i) => {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    };

    // posterize helper (reduce color levels)
    const posterizeAt = (i, levels = 4) => {
      const step = 255 / (levels - 1);
      data[i] = Math.round(data[i] / step) * step;
      data[i + 1] = Math.round(data[i + 1] / step) * step;
      data[i + 2] = Math.round(data[i + 2] / step) * step;
    };

    // contrast adjustment helper
    const applyContrast = (i, contrast = 1.0) => {
      // contrast: >1 increases, <1 decreases
      const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
      data[i] = clamp(factor * (data[i] - 128) + 128, 0, 255);
      data[i + 1] = clamp(factor * (data[i + 1] - 128) + 128, 0, 255);
      data[i + 2] = clamp(factor * (data[i + 2] - 128) + 128, 0, 255);
    };

    // Level mapping to filters:
    // 0 none, 1 grayscale, 2 invert, 3 noise, 4 desat+contrast, 5 posterize, 6 channel shift
    if (lvl === 0) return;

    if (lvl === 1) {
      // grayscale
      for (let i = 0; i < len; i += 4) grayscaleAt(i);
      return;
    }

    if (lvl === 2) {
      // invert
      for (let i = 0; i < len; i += 4) invertAt(i);
      return;
    }

    if (lvl === 3) {
      // noise: small random jitter per pixel (keeps mean)
      for (let i = 0; i < len; i += 4) {
        const noise = (Math.random() - 0.5) * 80; // ±40
        data[i] = clamp(data[i] + noise, 0, 255);
        data[i + 1] = clamp(data[i + 1] + noise, 0, 255);
        data[i + 2] = clamp(data[i + 2] + noise, 0, 255);
      }
      return;
    }

    if (lvl === 4) {
      // desaturate + increase contrast
      for (let i = 0; i < len; i += 4) {
        // desat: blend towards luminance
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        // desaturate strongly
        data[i] = r * 0.25 + lum * 0.75;
        data[i + 1] = g * 0.25 + lum * 0.75;
        data[i + 2] = b * 0.25 + lum * 0.75;
        // then slight contrast boost
        // contrast param from 0..1 where >0 increases contrast: choose 0.4
        const factor = 1.2; // mild contrast
        data[i] = clamp((data[i] - 128) * factor + 128, 0, 255);
        data[i + 1] = clamp((data[i + 1] - 128) * factor + 128, 0, 255);
        data[i + 2] = clamp((data[i + 2] - 128) * factor + 128, 0, 255);
      }
      return;
    }

    if (lvl === 5) {
      // posterize (reduce color depth)
      const levels = 5; // fewer levels -> harder
      for (let i = 0; i < len; i += 4) posterizeAt(i, levels);
      return;
    }

    if (lvl >= 6) {
      // channel shift: shift R/G/B by a few pixels using a simple offset strategy.
      // We'll build a copy and then shift pixels horizontally a few px for each channel.
      const width = imageData.width;
      const height = imageData.height;
      const copy = new Uint8ClampedArray(data); // copy
      const shift = 2 + ((lvl - 6) % 4); // shift 2..5 px depending on level
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const i = (y * width + x) * 4;
          // source positions with wrap
          const rx = (x - shift + width) % width;
          const gx = (x + shift + width) % width;
          const bx = (x + Math.floor(shift / 2) + width) % width;
          const ri = (y * width + rx) * 4;
          const gi = (y * width + gx) * 4;
          const bi = (y * width + bx) * 4;
          data[i] = copy[ri]; // R from shifted pos
          data[i + 1] = copy[gi + 1]; // G from shifted pos
          data[i + 2] = copy[bi + 2]; // B from shifted pos
          // alpha stays same
        }
      }
      return;
    }
  };

  // draw function: draws quadrants then applies pixel filter based on level
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = devicePixelRatioRef.current || 1;

    const w = size;
    const h = size;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // background
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#081017");
    grad.addColorStop(1, "#0f2533");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (!img) {
      ctx.fillStyle = "#333";
      ctx.fillRect(20, 20, w - 40, h - 40);
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText("Imagen no disponible", 30, 60);
      return;
    }

    const srcW = img.width;
    const srcH = img.height;
    const side = Math.min(srcW, srcH);
    const sx = (srcW - side) / 2;
    const sy = (srcH - side) / 2;
    const cellW = w / 2;
    const cellH = h / 2;
    const srcCellW = side / 2;
    const srcCellH = side / 2;

    const quadrants = [
      { sx: sx, sy: sy, dx: 0, dy: 0 },
      { sx: sx + srcCellW, sy: sy, dx: cellW, dy: 0 },
      { sx: sx, sy: sy + srcCellH, dx: 0, dy: cellH },
      { sx: sx + srcCellW, sy: sy + srcCellH, dx: cellW, dy: cellH },
    ];

    quadrants.forEach((q, idx) => {
      const rot = (rotations[idx] || 0) * (Math.PI / 180);
      const cx = q.dx + cellW / 2;
      const cy = q.dy + cellH / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.drawImage(
        img,
        q.sx,
        q.sy,
        srcCellW,
        srcCellH,
        -cellW / 2,
        -cellH / 2,
        cellW,
        cellH
      );
      ctx.restore();
    });

    // apply pixel filter for difficulty - we read and write pixel data manually
    if (level > 0) {
      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        applyPixelFilter(imageData, level);
        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        // CORS or security restrictions may block getImageData; warn and skip filter
        // eslint-disable-next-line no-console
        console.warn("Pixel filter could not be applied (CORS/security):", err);
      }
    }

    // decorations
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }, [size, rotations, level]);

  // when rotations change, redraw and detect completion
  useEffect(() => {
    draw();
    const completed = rotations.every((r) => r % 360 === 0);
    if (completed && !isCompleted) {
      setIsCompleted(true);
      // after short delay, advance level and reshuffle (reshuffle happens on level effect)
      setTimeout(() => {
        setLevel((lvl) => lvl + 1);
      }, 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotations]);

  // turn off completion flag after animation
  useEffect(() => {
    if (isCompleted) {
      const t = setTimeout(() => setIsCompleted(false), 1400);
      return () => clearTimeout(t);
    }
  }, [isCompleted]);

  // expose some controls: shuffle, reset, level +/- etc.
  return (
    <div className="blocka-container">
      <canvas
        ref={canvasRef}
        className={`blocka-canvas ${isCompleted ? "completed" : ""}`}
        width={size}
        height={size}
        onContextMenu={(e) => e.preventDefault()}
      />
      {isCompleted && <div className="blocka-win">¡Nivel completado!</div>}

      <div className="blocka-controls">
        <button
          onClick={() =>
            setRotations(() =>
              [0, 1, 2, 3].map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
            )
          }
        >
          🔀 Mezclar
        </button>
        <button onClick={() => setLevel((v) => Math.max(0, v - 1))}>⬇ Nivel -</button>
        <span className="blocka-level">Nivel: {level}</span>
        <button onClick={() => setLevel((v) => Math.min(100, v + 1))}>⬆ Nivel +</button>
      </div>

      <p className="blocka-hint">
        🖱️ Click izquierdo: rota +90°. Click derecho: rota -90°. Cualquier nivel puede aplicar un filtro.
      </p>
    </div>
  );
}
