// src/.../useHandler.js
import toast from "react-hot-toast";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";
import pelotaImg from "../../../assets/imgs/Pelotafutbol.png";
import pelotaImg2 from "../../../assets/imgs/football1.png";
import pelotaImg3 from "../../../assets/imgs/football2.png";
import pelotaImg4 from "../../../assets/imgs/football3.png";
import pelotaImg5 from "../../../assets/imgs/football4.png";

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
  modoBoostActivo,
  setModoBoostActivo,
  messiBoostDisponible,
  setMessiBoostDisponible,
  animateEatenPiece // callback para pasar al controlador nuevo en restart
) {
  //CLIC
  function handleMouseDown(e) {
    if (!controller) return;
    const { clientX, clientY } = getClientPos(e); //Obtiene las coordenadas de dónde se hizo clic en píxeles
    const pos = getCellCoords(clientX, clientY); //Traduce esos píxeles a un casillero(Fila y Columna)
    if (!pos) return;

    const { x, y, rect } = pos;
    const c = controller.model.getCasillero(x, y);
    if (!c?.ocupado) return; //Si está no ocupado no se puede arrastrar

    //Activación del arrastre
    controller.selectPiece(x, y, modoBoostActivo); //Va al Controller, Model y Vista
    setDragging(true); //Interruptor
    setDragOrigin({ x, y });
    setDragPos({ x: clientX, y: clientY });

    setDragOffset({
      x: clientX - (x * cellSize + cellSize / 2 + rect.left),
      y: clientY - (y * cellSize + cellSize / 2 + rect.top),
    });

    draw(controller);
  }

  //ARRASTRE
  function handleMouseMove(e) {
    if (!dragging) return; //Comprueba que estés arrastrando una ficha
    const { clientX, clientY } = getClientPos(e);
    setDragPos({ x: clientX, y: clientY }); //Va cambiando la pos donde se Arrastra la Ficha
    draw(controller); //Dibuja el arrastre(si no, no se ve la ficha moviéndose)
  }

  function handleMouseUp(e) {
    if (!dragging) return;

    const { clientX, clientY } = getClientPos(e);
    const pos = getCellCoords(clientX, clientY);

    // --- Messi Boost: mover ficha a cualquier casillero vacío UNA VEZ ---
    if (
      modoBoostActivo &&
      messiBoostDisponible &&
      controller &&
      pos &&
      setModoBoostActivo && // sanity check
      setMessiBoostDisponible
    ) {
      const origen = controller.model.getCasillero?.( // origen como casillero real
        typeof setDragOrigin === "function" ? undefined : undefined
      );

      // dragOrigin guardado en el componente; necesitamos accederlo vía controller.selected o desde fuera.
      // Suponemos que cuando se inicia el drag se llamó controller.selectPiece(...) y controller.selected está seteado.
      const origenCasillero = controller.selected
        ? controller.selected
        : (dragPos && controller.model.getCasillero && controller.model.getCasillero(dragPos.x, dragPos.y)); // fallback (no ideal)

      // mejor obtener el origen REAL del selection (si existe):
      const origenReal = controller.selected || (dragPos && controller.model.getCasillero(dragPos.x, dragPos.y));

      // Si no hay selected, intentar con dragOrigin si fue pasado (mejor: componente pasa dragOrigin correcto).
      // Para seguridad, intentar con dragOrigin del closure (se usa setDragOrigin en el componente).
      // Aquí asumimos que controller.selected es la fuente más confiable:
      const origenFinal = controller.selected
        ? controller.selected
        : null;

      const destino = controller.model.getCasillero(pos.x, pos.y);

      if (origenFinal && origenFinal.ocupado && destino && !destino.ocupado) {
        // mover ficha: trasladar objeto ficha
        destino.ficha = origenFinal.ficha;
        destino.ocupado = true;

        origenFinal.ficha = null;
        origenFinal.ocupado = false;

        // limpiar selección del controller
        controller.clearSelection();

        // actualizar estados de boost
        setModoBoostActivo(false);
        setMessiBoostDisponible(false);

        toast.success("¡Messi Boost usado! ⚡ Golazo de media cancha!");
        draw(controller);

        // terminar drag
        setDragging(false);
        setDragOffset({ x: 0, y: 0 });
        setDragPos({ x: 0, y: 0 });

        return;
      }
      // si no pudo aplicarse el boost, seguimos con el movimiento normal abajo
    }

    // Movimiento normal (salto)
    if (pos && controller) {
      controller.movePiece(pos.x, pos.y, setFichasRestantes);
    } else if (controller) {
      controller.clearSelection();
    }

    setDragging(false);
    setDragOffset({ x: 0, y: 0 });
    draw(controller);
  }

  const handleRestart = () => {
    detenerCronometro();
    setTiempoAlcanzado(false);
    setFichasRestantes(cantFichas);
    setMessiBoostDisponible(true);
    setModoBoostActivo(false);

    // cargar imágenes (sin esperar onload para reiniciar más rápido)
    const imagenes = [pelotaImg, pelotaImg2, pelotaImg3, pelotaImg4, pelotaImg5].map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    const tablero = new Tablero(9, 9, imagenes);
    // pasar la viewCallback y animateEatenPiece (si se pasó)
    const ctrl = new GameController(
      tablero,
      () => draw(ctrl),
      (ficha) => {
        if (typeof animateEatenPiece === "function") animateEatenPiece(ficha);
      }
    );

    setController(ctrl);
    draw(ctrl);
    iniciarCronometro();
    toast.success("Juego reiniciado");
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleRestart,
  };
}
