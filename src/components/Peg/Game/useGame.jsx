import pelotaImg from "../../../assets/imgs/Pelotafutbol.png";
import pelotaImg2 from "../../../assets/imgs/football1.png"
import pelotaImg3 from "../../../assets/imgs/football2.png"
import pelotaImg4 from "../../../assets/imgs/football3.png"
import pelotaImg5 from "../../../assets/imgs/football4.png"

export default function useGame(
  ctrl,
  canvasRef,
  dragging,
  cellSize,
  setCellSize,
  dragPos,
  dragOffset
) {


  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || !ctrl) return;

    const ctx = canvas.getContext("2d");
    const tablero = ctrl.model;

    const canvasSize = canvas.width; // 300
    const newSize = canvasSize / 7;
    if (newSize !== cellSize) setCellSize(newSize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < tablero.filas; y++) {
      for (let x = 0; x < tablero.columnas; x++) {

        const c = tablero.getCasillero(x, y);
        if (!c) continue;

        const cx = x * cellSize + cellSize / 2;
        const cy = y * cellSize + cellSize / 2;

        // casilla
        ctx.fillStyle = "#f0d9b5";
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.strokeStyle = "#333";
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        const esHint = ctrl.validMoves.some(m => m.x === x && m.y === y);
        if (esHint) {
          ctx.fillStyle = "rgba(0,255,0,0.3)";
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

        const esOrigenArrastrado =
          dragging && ctrl.selected && ctrl.selected.x === x && ctrl.selected.y === y;

        if (c.ocupado && c.ficha && !esOrigenArrastrado) {
          const img = c.ficha.imagen;
          if (img) {
            ctx.drawImage(
              img,
              cx - cellSize / 3,
              cy - cellSize / 3,
              (cellSize / 3) * 2,
              (cellSize / 3) * 2
            );
          }
        }

      }
    }

    // dragging piece
    if (dragging && ctrl.selected) {
      const rect = canvas.getBoundingClientRect();
      const drawX = dragPos.x - rect.left - dragOffset.x;
      const drawY = dragPos.y - rect.top - dragOffset.y;

      const selCasillero = ctrl.model.getCasillero(ctrl.selected.x, ctrl.selected.y);
      const img = selCasillero?.ficha?.imagen;

      if (img) {
        ctx.drawImage(
          img,
          drawX - cellSize / 3,
          drawY - cellSize / 3,
          (cellSize / 3) * 2,
          (cellSize / 3) * 2
        );
      }
    }

  }


  // Utils
  function getClientPos(e) {
    return e.touches
      ? { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }
      : { clientX: e.clientX, clientY: e.clientY };
  }

  function getCellCoords(clientX, clientY) {
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    const x = Math.floor(relX / cellSize);
    const y = Math.floor(relY / cellSize);
    const dentro = x >= 0 && y >= 0 && x < 7 && y < 7 && ((x >= 2 && x <= 4) || (y >= 2 && y <= 4));
    return dentro ? { x, y, rect } : null;
  }


  return {
    getCellCoords,
    getClientPos,
    draw,
  }
}