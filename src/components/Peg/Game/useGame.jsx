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
  dragOffset,
  animatingPiece,
  animationProgress
) {


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
    const dentro = x >= 0 && y >= 0 && x < 9 && y < 9 && ((x >= 3 && x <= 5) || (y >= 3 && y <= 5));
    return dentro ? { x, y, rect } : null;
  }



  // Modificar la función draw para incluir la ficha en animación
  function draw() {
    const canvas = canvasRef.current;
    if (!canvas || !ctrl) return;

    const ctx = canvas.getContext("2d");
    const tablero = ctrl.model;

    const canvasSize = canvas.width;
    const newSize = canvasSize / 9;
    if (newSize !== cellSize) setCellSize(newSize);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar el tablero normal
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

        const esOrigenArrastrado = dragging && ctrl.selected && ctrl.selected.x === x && ctrl.selected.y === y;

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

      if (animatingPiece) {
        const ctx = canvas.getContext("2d");
        const { x, y, img } = animatingPiece;

        const scale = 1 - animationProgress; // se achica hasta desaparecer
        const alpha = 1 - animationProgress; // se desvanece
        const size = cellSize * scale;

        const drawX = x * cellSize + cellSize / 2;
        const drawY = y * cellSize + cellSize / 2;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, drawX - size / 2, drawY - size / 2, size, size);
        ctx.restore();
      }

    }

    // Dibujar pieza en animación si existe
    if (animatingPiece && animatingPiece.imagen) {
      // Necesitamos saber la posición del medio. Como no tenemos el destino, asumimos que es el último movimiento válido.
      // Para simplificar, podemos calcular basado en el movimiento actual, pero como no tenemos el destino aquí,
      // mejor pasamos la posición del medio desde el controller.

      // Por ahora, hardcodear una posición para testear, luego ajustaremos.
      const cx = 4 * cellSize + cellSize / 2; // Centro del tablero
      const cy = 4 * cellSize + cellSize / 2;

      // Escala: de 1x a 1.5x
      const scale = 1 + animationProgress * 0.5;
      const size = (cellSize / 3) * 2 * scale;

      // Opacidad: de 1 a 0
      ctx.globalAlpha = 1 - animationProgress;

      ctx.drawImage(
        animatingPiece.imagen,
        cx - size / 2,
        cy - size / 2,
        size,
        size
      );

      // Restaurar opacidad
      ctx.globalAlpha = 1;
    }

    // Dibujar pieza siendo arrastrada
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

  return {
    getCellCoords,
    getClientPos,
    draw,
  }
}