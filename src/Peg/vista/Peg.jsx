import React, { useRef, useEffect, useState } from "react";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";

export default function PegSolitaireCanvas() {
  const canvasRef = useRef(null);
  const [controller, setController] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const size = 60; // tamaño por casillero

  // Inicializa modelo y controller
  useEffect(() => {
    //si o si 7x7 a menos que modifiques el modelo
    const tablero = new Tablero(7, 7);
    //le pasa draw para que pueda refrescar la vista luego de cada movimiento
    const ctrl = new GameController(tablero, () => draw(ctrl));
    setController(ctrl);
    draw(ctrl);
  }, []);

  function draw(ctrl) {
    const canvas = canvasRef.current;
    if (!canvas || !ctrl) return;
    const ctx = canvas.getContext("2d");
    const tablero = ctrl.model;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tablero.filas; y++) {
      for (let x = 0; x < tablero.columnas; x++) {
        const c = tablero.getCasillero(x, y);
        if (!c) continue; // omitir zonas fuera del tablero
        const cx = x * size + size / 2;
        const cy = y * size + size / 2;

        // casilla
        ctx.fillStyle = "#f0d9b5";
        ctx.beginPath();
        ctx.rect(x * size, y * size, size, size);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.stroke();

        // hint (movimientos válidos), si algun valor M en x y en y de validMoves  coincide con el actual x e y del for es true
        const esHint = ctrl.validMoves.some((m) => m.x === x && m.y === y);
        if (esHint) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
          ctx.fillRect(x * size, y * size, size, size);
        }

        // fichas, excepto la que se está arrastrando
        //verifica si la actual es la que se esta arrastrando
        const esOrigenArrastrado =
          dragging &&
          ctrl.selected &&
          ctrl.selected.x === x &&
          ctrl.selected.y === y;
          //si no esta siendo arrastrada pero si seleccionada (atributo del controller que guarda la ficha seleccionada) la dibuja celeste en el lugar sino marron
        if (c && c.ocupado && !esOrigenArrastrado) {
          ctx.beginPath();
          ctx.arc(cx, cy, size / 3, 0, Math.PI * 2);
          ctx.fillStyle = ctrl.selected === c ? "#3498db" : "#8B4513";
          ctx.fill();
        }
      }
    }

    // Dibuja ficha en arrastre (si hay)
    //
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
// devuelve la posicion del mouse en clientX y clientY
  function getClientPos(e) {
    return { clientX: e.clientX, clientY: e.clientY };
  }
  // convierte la posicion del mouse en coordenadas del tablero
  function getCellCoords(clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect();
    //ajusta la posicion del mouse relativa al canvas
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    //si esta fuera del canvas devuelve null
    if (relX < 0 || relY < 0) return null;

    const x = Math.floor(relX / size);
    const y = Math.floor(relY / size);
    //verifica que este dentro de la cruz
    const dentro =
      x >= 0 && y >= 0 && x < 7 && y < 7 && ((x >= 2 && x <= 4) || (y >= 2 && y <= 4));
    if (!dentro) return null;

    return { x, y, rect, relX, relY };
  }

  /* ===========================
      HANDLERS DRAG&DROP
  ============================ */

  function handleMouseDown(e) {
    //si no cargo el controller sale
    if (!controller) return;

    //tanto click izquierdo como derecho o boton central
    e.preventDefault();
    //guarda la posicion del mouse
    const { clientX, clientY } = getClientPos(e);
    //guarda en pos las coordenadas del casillero donde hizo click
    const pos = getCellCoords(clientX, clientY);
    if (!pos) return;

    const c = controller.model.getCasillero(pos.x, pos.y);

    if (c && c.ocupado) {
      controller.selectPiece(pos.x, pos.y);
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

    const pos = getCellCoords(clientX, clientY);
    if (pos) {
      // Solo actualiza si el cursor está dentro del tablero
      setDragPos({ x: clientX, y: clientY });
      draw(controller);
    }
  }

  function handleMouseUp(e) {
    if (!dragging || !controller) return;
    e.preventDefault();

    const { clientX, clientY } = getClientPos(e);
    const pos = getCellCoords(clientX, clientY);

    if (pos) {
      const { x, y } = pos;
      controller.movePiece(x, y);
    } else {
      controller.clearSelection(); // si suelta fuera del tablero
    }

    setDragging(false);
    setDragOrigin(null);
    setDragOffset({ x: 0, y: 0 });
    setDragPos({ x: 0, y: 0 });

    draw(controller);
  }

  return (
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
  );
}