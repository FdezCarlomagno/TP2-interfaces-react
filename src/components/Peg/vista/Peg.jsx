import React, { useRef, useEffect, useState } from "react";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";
import useTimer from '../Timer/useTimer';
import "./peg.css";
import pelotaImg from "../../../assets/imgs/Pelotafutbol.png";
import useGame from "../Game/useGame";
import useHandler from "../Game/useHandler";

export default function Peg() {
  const { levelTimer, detenerCronometro, iniciarCronometro, formatearTiempo } = useTimer();
  const canvasRef = useRef(null);
  const [controller, setController] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState(null);
  const cantFichas = 32;
  const [fichasRestantes, setFichasRestantes] = useState(cantFichas);

  const [cellSize, setCellSize] = useState(60); // ✅ tamaño dinámico
  const tiempoMaximo = 3;
  const [tiempoAlcanzado, setTiempoAlcanzado] = useState(false);
  const [pelotaImage, setPelotaImage] = useState(null);

  const {
    getCellCoords,
    getClientPos,
    draw
  } = useGame(
    controller,
    canvasRef,
    dragging,
    pelotaImage,
    cellSize,
    setCellSize,
    dragPos,
    dragOffset
  )

  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleRestart
  } = useHandler(
    controller,
    dragging,
    setDragging,
    setDragOrigin,
    setDragPos,
    setDragOffset,
    setController,
    setTiempoAlcanzado,
    setFichasRestantes,
    getCellCoords,
    getClientPos,
    draw,
    cellSize,
    dragPos,
    cantFichas
  )

  // Init
  useEffect(() => {
    const img = new Image();
    img.src = pelotaImg;
    img.onload = () => setPelotaImage(img);

    iniciarCronometro();
    const tablero = new Tablero(7, 7);
    const ctrl = new GameController(tablero, () => draw(ctrl));
    setController(ctrl);
    draw(ctrl);
  }, []);

  useEffect(() => {
    if (controller) draw(controller);
  }, [pelotaImage]);

  // Tiempo máximo
  useEffect(() => {
    if (!levelTimer.corriendo || tiempoAlcanzado) return;
    const minutos = parseInt(formatearTiempo(levelTimer.tiempo).minutos);
    if (minutos >= tiempoMaximo) {
      setTiempoAlcanzado(true);
      detenerCronometro();
      setTimeout(() => {
        alert("Tiempo máximo alcanzado, reiniciando...");
        handleRestart();
      }, 200);
    }
  }, [levelTimer.tiempo]);


  return (
    <>
      <div className="cronometro-peg">
        <div>Tiempo: {formatearTiempo(levelTimer.tiempo).minutos}:{formatearTiempo(levelTimer.tiempo).segundos}</div>
        <div>Máximo: {tiempoMaximo} min</div>
        {tiempoAlcanzado && <div style={{ color: 'red', fontWeight: 'bold' }}>¡TIEMPO AGOTADO!</div>}
      </div>

      <div className="peg-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          style={{
            display: "block",
            width: "100%",
            maxWidth: "420px",
            border: "1px solid black",
            cursor: dragging ? "grabbing" : "pointer",
            touchAction: "none"
          }}

          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        />
      </div>

      <div className="peg-info">
        <p>Fichas restantes: {fichasRestantes}</p>
        <button className="reset" onClick={handleRestart}>Reiniciar</button>
      </div>
    </>
  );
}
