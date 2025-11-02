import useTimer from "../Timer/useTimer";
import useGame from "./useGame";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";


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
    detenerCronometro
){

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
          y: clientY - (y * cellSize + cellSize / 2 + rect.top)
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
          console.log("restart")
          detenerCronometro();
          setTiempoAlcanzado(false);
          setFichasRestantes(cantFichas);
          const tablero = new Tablero(7, 7);
          const ctrl = new GameController(tablero, null); // inicializamos con null

          // Ahora sí le asignamos el callback que apunta al nuevo controller
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
      }
}