import useTimer from "../Timer/useTimer";
import useGame from "./useGame";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";
import pelotaImg from "../../../assets/imgs/Pelotafutbol.png";
import pelotaImg2 from "../../../assets/imgs/football1.png"
import pelotaImg3 from "../../../assets/imgs/football2.png"
import pelotaImg4 from "../../../assets/imgs/football3.png"
import pelotaImg5 from "../../../assets/imgs/football4.png"

export default function useHandler(
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
  cantFichas,
  iniciarCronometro,
  detenerCronometro,
) {
  // Handlers
  function handleMouseDown(e) {
    if (!controller) return;
    const { clientX, clientY } = getClientPos(e);
    const pos = getCellCoords(clientX, clientY);
    if (!pos) return;

    const { x, y, rect } = pos;
    const c = controller.model.getCasillero(x, y);
    if (!c?.ocupado) return;

    controller.selectPiece(x, y);
    setDragging(true);
    setDragOrigin({ x, y });
    setDragPos({ x: clientX, y: clientY });

    setDragOffset({
      x: clientX - (x * cellSize + cellSize / 2 + rect.left),
      y: clientY - (y * cellSize + cellSize / 2 + rect.top),
    });

    draw(controller);
  }

  function handleMouseMove(e) {
    if (!dragging) return;
    const { clientX, clientY } = getClientPos(e);
    setDragPos({ x: clientX, y: clientY });
    draw(controller);
  }

  function handleMouseUp(e) {
    if (!dragging) return;
    const { clientX, clientY } = getClientPos(e);
    const pos = getCellCoords(clientX, clientY);

    if (pos) controller.movePiece(pos.x, pos.y, setFichasRestantes);
    else controller.clearSelection();

    setDragging(false);
    setDragOffset({ x: 0, y: 0 });
    draw(controller);
  }

  const handleRestart = () => {
    console.log("restart");

    detenerCronometro();
    setTiempoAlcanzado(false);
    setFichasRestantes(cantFichas);

    //Crear las imágenes aleatorias igual que al inicio
    const imagenes = [pelotaImg, pelotaImg2, pelotaImg3, pelotaImg4, pelotaImg5].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    //Crear el nuevo tablero con las fichas individuales
    const tablero = new Tablero(7, 7, imagenes);

    //Crear el nuevo controlador con el tablero
    const ctrl = new GameController(tablero, null);

    //Asignar callback de dibujo al nuevo controlador
    ctrl.viewCallback = () => draw(ctrl);

    setController(ctrl);
    draw(ctrl);
    iniciarCronometro();
  };


  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleRestart,
  };
}
