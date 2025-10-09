import React, { useRef, useEffect, useState, useCallback } from "react";
import messiFace from "../../assets/imgs/messiFace.png";
/*
  BlockaGame (canvas only)
  - Renders an image split into 4 quadrants, each initially rotated (random).
  - Left click on a quadrant -> rotate +90deg. Right click -> rotate -90deg.
  - Applies pixel-level filters by reading ImageData and modifying pixels in JS.
  - Props:
     - imageSrc: path to the image asset (default '/assets/messiFace.png')
     - size: canvas size in px (square). Default 640.
     - initialLevel: difficulty level (0 = no filter, 1 = grayscale, 2 = invert)
  - No external libs. Prevents context menu on canvas to allow right-click handling.
*/

export default function BlockaGame({
  imageSrc = messiFace,
  size = 640,
  initialLevel = 0,
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [rotations, setRotations] = useState([0, 90, 180, 270]); // degrees for each quadrant
  const [level, setLevel] = useState(initialLevel);
  const [loaded, setLoaded] = useState(false);
  const devicePixelRatioRef = useRef(window.devicePixelRatio || 1);

  // shuffle initial rotations a bit for gameplay
  useEffect(() => {
    setRotations((r) =>
      r
        .map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
        .slice(0, 4)
    );
  }, []);

  // load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    // support imported modules (imageSrc.default) or plain strings
    img.src = imageSrc && imageSrc.default ? imageSrc.default : imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
      draw(); // initial draw
    };
    img.onerror = () => {
      // fallback: mark not loaded so canvas shows placeholder; log for debugging
      // eslint-disable-next-line no-console
      console.error("BlockaGame: image failed to load:", imageSrc);
      setLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  // utility: clamp
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // compute which quadrant given a canvas coordinate
  const getQuadrant = (x, y, w, h) => {
    const mx = w / 2;
    const my = h / 2;
    if (x < mx && y < my) return 0; // top-left
    if (x >= mx && y < my) return 1; // top-right
    if (x < mx && y >= my) return 2; // bottom-left
    return 3; // bottom-right
  };

  // rotate quadrant by delta degrees (multiple of 90)
  const rotateQuadrant = useCallback(
    (index, delta) => {
      setRotations((prev) => {
        const next = prev.slice();
        next[index] = ((next[index] + delta) % 360 + 360) % 360;
        return next;
      });
    },
    [setRotations]
  );

  // handle left / right click
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerDown = (e) => {
      // use bounding rect to compute coordinates
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
      const y = ((e.clientY - rect.top) * canvas.height) / rect.height;
      const quadrant = getQuadrant(x, y, canvas.width, canvas.height);
      if (e.button === 0) {
        // left click
        rotateQuadrant(quadrant, 90);
      } else if (e.button === 2) {
        // right click
        rotateQuadrant(quadrant, -90);
      }
    };

    // prevent the default context menu so right click is usable
    const onContext = (e) => e.preventDefault();

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("contextmenu", onContext);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("contextmenu", onContext);
    };
  }, [rotateQuadrant]);

  // draw loop - draws 4 rotated quadrants then applies pixel filter depending on level
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = devicePixelRatioRef.current || 1;

    // logical size
    const w = size;
    const h = size;

    // set canvas physical size for crisp rendering
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale ctx to handle DPR

    // clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0b1116";
    ctx.fillRect(0, 0, w, h);

    // If image not loaded, draw a placeholder
    if (!img) {
      ctx.fillStyle = "#333";
      ctx.fillRect(20, 20, w - 40, h - 40);
      ctx.fillStyle = "#fff";
      ctx.font = "18px sans-serif";
      ctx.fillText("Imagen no disponible", 30, 60);
      return;
    }

    // Determine source size - keep aspect ratio and crop to square center
    const srcW = img.width;
    const srcH = img.height;
    const side = Math.min(srcW, srcH);
    const sx = Math.floor((srcW - side) / 2);
    const sy = Math.floor((srcH - side) / 2);
    const cellW = w / 2;
    const cellH = h / 2;
    const srcCellW = side / 2;
    const srcCellH = side / 2;

    // For each quadrant: compute source and destination rects, apply rotation
    const quadrants = [
      { sx: sx, sy: sy, dx: 0, dy: 0 }, // top-left
      { sx: sx + srcCellW, sy: sy, dx: cellW, dy: 0 }, // top-right
      { sx: sx, sy: sy + srcCellH, dx: 0, dy: cellH }, // bottom-left
      { sx: sx + srcCellW, sy: sy + srcCellH, dx: cellW, dy: cellH }, // bottom-right
    ];

    quadrants.forEach((q, idx) => {
      const rot = (rotations[idx] || 0) * (Math.PI / 180);
      // draw each quadrant centered in its destination cell with rotation
      const cx = q.dx + cellW / 2;
      const cy = q.dy + cellH / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      // When rotated by 90/270, width/height swap. drawImage draws at top-left relative to rotated origin.
      // We want the quadrant to fit into cellW x cellH.
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

    // Apply pixel filter according to level
    if (level > 0) {
      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        // iterate pixels with classic double-for but linear indexing for speed
        // level 1: grayscale, level 2: invert, level >=3: invert + mild desaturate
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (level === 1) {
            // grayscale
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            data[i] = data[i + 1] = data[i + 2] = lum;
          } else if (level === 2) {
            // invert
            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
          } else {
            // combined: invert then partial desaturate
            let nr = 255 - r;
            let ng = 255 - g;
            let nb = 255 - b;
            const lum = 0.299 * nr + 0.587 * ng + 0.114 * nb;
            // blend lum and inverted color depending on level (more level -> more desat)
            const t = clamp((level - 2) / 3, 0, 1); // normalized extra
            data[i] = nr * (1 - t) + lum * t;
            data[i + 1] = ng * (1 - t) + lum * t;
            data[i + 2] = nb * (1 - t) + lum * t;
          }
          // alpha stays the same (data[i+3])
        }
        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        // security error if CORS blocked - ignore filter in that case
        // (To avoid this, ensure image is served with CORS allowed or placed in public folder)
        // eslint-disable-next-line no-console
        console.warn("Unable to apply pixel filter (CORS?)", err);
      }
    }

    // small border and indicators
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // draw quadrant separators
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }, [size, rotations, level]);

  // redraw whenever rotations or level or image change
  useEffect(() => {
    draw();
  }, [rotations, level, draw, loaded]);

  // controls: keyboard for level +/- and reset/shuffle
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "+" || e.key === "=") setLevel((v) => Math.min(v + 1, 6));
      if (e.key === "-") setLevel((v) => Math.max(v - 1, 0));
      if (e.key === "r") {
        setRotations((r) =>
          r.map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)])
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // UI: small controls but canvas-only rendering for the game area (controls outside canvas allowed)
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <canvas
        ref={canvasRef}
        style={{ cursor: "pointer", background: "#051015", borderRadius: 8 }}
        width={size}
        height={size}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() =>
            setRotations((r) => r.map(() => [0, 90, 180, 270][Math.floor(Math.random() * 4)]))
          }
        >
          Mezclar
        </button>
        <button onClick={() => setRotations([0, 0, 0, 0])}>Restablecer</button>
        <button onClick={() => setLevel((v) => Math.max(0, v - 1))}>Nivel -</button>
        <div style={{ minWidth: 80, textAlign: "center" }}>Nivel: {level}</div>
        <button onClick={() => setLevel((v) => Math.min(6, v + 1))}>Nivel +</button>
      </div>
      <div style={{ fontSize: 12, color: "#999", maxWidth: 600, textAlign: "center" }}>
        Click izquierdo: rota +90°. Click derecho: rota -90°. Los filtros se aplican recorriendo los
        píxeles (JS). Asegurate de que la imagen esté servida con CORS si está en otro origen.
      </div>
    </div>
  );
}