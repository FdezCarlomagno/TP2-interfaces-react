import React, { useRef, useEffect, useState } from "react";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";
import useTimer from '../Timer/useTimer'
import "./peg.css"

export default function Peg() {
  const { levelTimer, detenerCronometro, iniciarCronometro, formatearTiempo, setLevelTimer } = useTimer()
  const canvasRef = useRef(null);
  const [controller, setController] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState(null); // Añadido esta línea que faltaba
  const cantFichas = 32
  const [fichasRestantes, setFichasRestantes] = useState(cantFichas)
  const size = 60;
  const tiempoMaximo = 3
  const [tiempoAlcanzado, setTiempoAlcanzado] = useState(false); // Nuevo estado para controlar

  // Inicializa modelo y controller
  useEffect(() => {
    iniciarCronometro()
    const tablero = new Tablero(7, 7);
    const ctrl = new GameController(tablero, () => draw(ctrl));
    setController(ctrl);
    draw(ctrl);
  }, []);

  // Control del tiempo máximo - CORREGIDO
  useEffect(() => {
    if (levelTimer.corriendo && !tiempoAlcanzado) {
      const minutosTranscurridos = formatearTiempo(levelTimer.tiempo).minutos;
      if (parseInt(minutosTranscurridos) >= tiempoMaximo) {
        setTiempoAlcanzado(true);
        detenerCronometro();
        setTimeout(() => {
          alert("Tiempo máximo alcanzado, reiniciando...");
          handleRestart();
        }, 100);
      }
    }
  }, [levelTimer.tiempo, levelTimer.corriendo, tiempoAlcanzado]);

  function draw(ctrl) {
    const canvas = canvasRef.current;
    if (!canvas || !ctrl) return;
    const ctx = canvas.getContext("2d");
    const tablero = ctrl.model;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tablero.filas; y++) {
      for (let x = 0; x < tablero.columnas; x++) {
        const c = tablero.getCasillero(x, y);
        if (!c) continue;
        const cx = x * size + size / 2;
        const cy = y * size + size / 2;

        // casilla
        ctx.fillStyle = "#f0d9b5";
        ctx.beginPath();
        ctx.rect(x * size, y * size, size, size);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();

        // hint (movimientos válidos)
        const esHint = ctrl.validMoves.some((m) => m.x === x && m.y === y);
        if (esHint) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
          ctx.fillRect(x * size, y * size, size, size);
        }

        // fichas, excepto la que se está arrastrando
        const esOrigenArrastrado =
          dragging &&
          ctrl.selected &&
          ctrl.selected.x === x &&
          ctrl.selected.y === y;
        if (c && c.ocupado && !esOrigenArrastrado) {
          ctx.beginPath();
          ctx.arc(cx, cy, size / 3, 0, Math.PI * 2);
          ctx.fillStyle = ctrl.selected === c ? "#3498db" : "#8B4513";
          ctx.fill();
        }
      }
    }

    // Dibuja ficha en arrastre (si hay)
    if (dragging && ctrl && ctrl.selected) {
      const canvasRect = canvas.getBoundingClientRect();
      const drawX = dragPos.x - canvasRect.left - dragOffset.x;
      const drawY = dragPos.y - canvasRect.top - dragOffset.y;
      ctx.beginPath();
      ctx.arc(drawX, drawY, size / 3, 0, Math.PI * 2);
      ctx.fillStyle = "#3498db";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.stroke();
    }
  }

  function getClientPos(e) {
    if (e.type.includes('touch')) {
      return { 
        clientX: e.touches[0].clientX, 
        clientY: e.touches[0].clientY 
      };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  }

  function getCellCoords(clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    if (relX < 0 || relY < 0) return null;

    const x = Math.floor(relX / size);
    const y = Math.floor(relY / size);
    const dentro =
      x >= 0 && y >= 0 && x < 7 && y < 7 && ((x >= 2 && x <= 4) || (y >= 2 && y <= 4));
    if (!dentro) return null;

    return { x, y, rect, relX, relY };
  }

  /* ===========================
      HANDLERS DRAG&DROP
  ============================ */

  function handleMouseDown(e) {
    if (!controller) return;

    e.preventDefault();
    const { clientX, clientY } = getClientPos(e);
    const pos = getCellCoords(clientX, clientY);
    if (!pos) return;

    const { x, y, rect } = pos; // CORREGIDO: usar las variables del objeto pos
    const c = controller.model.getCasillero(x, y);

    if (c && c.ocupado) {
      controller.selectPiece(x, y); // CORREGIDO: usar x, y de pos
      setDragging(true);
      setDragOrigin({ x, y });
      setDragPos({ x: clientX, y: clientY });

      const centerX = x * size + size / 2 + rect.left;
      const centerY = y * size + size / 2 + rect.top;
      setDragOffset({ x: clientX - centerX, y: clientY - centerY });
    }

    draw(controller);
  }

  function handleMouseMove(e) {
    if (!dragging || !controller) return;
    e.preventDefault();

    const { clientX, clientY } = getClientPos(e);
    setDragPos({ x: clientX, y: clientY });
    draw(controller);
  }

  function handleMouseUp(e) {
    if (!dragging || !controller) return;
    e.preventDefault();

    const { clientX, clientY } = getClientPos(e);
    const pos = getCellCoords(clientX, clientY);

    if (pos) {
      const { x, y } = pos;
      controller.movePiece(x, y, setFichasRestantes);
    } else {
      controller.clearSelection();
    }

    setDragging(false);
    setDragOrigin(null);
    setDragOffset({ x: 0, y: 0 });
    setDragPos({ x: 0, y: 0 });
    draw(controller);
  }

  const handleRestart = () => {
    detenerCronometro();
    setTiempoAlcanzado(false); // Resetear el flag de tiempo alcanzado
    setFichasRestantes(cantFichas);
    
    const tablero = new Tablero(7, 7);
    const ctrl = new GameController(tablero, () => draw(ctrl));
    setController(ctrl);
    draw(ctrl);
    
    // Iniciar cronómetro después de un pequeño delay para evitar conflictos
    setTimeout(() => {
      iniciarCronometro();
    }, 100);
  }

  return (
    <>
      <div className="cronometro-peg">
        <div>
          Tiempo: {formatearTiempo(levelTimer.tiempo).minutos}:{formatearTiempo(levelTimer.tiempo).segundos}
        </div>
        <div>
          Máximo: {tiempoMaximo} minuto{tiempoMaximo !== 1 ? 's' : ''}
        </div>
        {tiempoAlcanzado && <div style={{color: 'red', fontWeight: 'bold'}}>¡TIEMPO AGOTADO!</div>}
      </div>
      <canvas
        ref={canvasRef}
        width={420}
        height={420}
        style={{
          border: "1px solid black",
          cursor: dragging ? "grabbing" : "pointer",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      />
      <div className="peg-info">
        <p>Fichas restantes: {fichasRestantes}</p>
        <button onClick={handleRestart}>Reiniciar</button>
      </div>
    </>
  );
}