import React, { useRef, useEffect, useState } from "react";
import { Tablero } from "../model/PegModel";
import { GameController } from "../controller/PegController";
import useTimer from '../Timer/useTimer';
import "./peg.css";
import pelotaImg from "../../../assets/imgs/Pelotafutbol.png";
import pelotaImg2 from "../../../assets/imgs/football1.png"
import pelotaImg3 from "../../../assets/imgs/football2.png"
import pelotaImg4 from "../../../assets/imgs/football3.png"
import pelotaImg5 from "../../../assets/imgs/football4.png"


import useGame from "../Game/useGame";
import useHandler from "../Game/useHandler";
import toast, { Toaster } from "react-hot-toast";

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
  const [showInstructions, setShowInstructions] = useState(false)

  const [cellSize, setCellSize] = useState(60); // ✅ tamaño dinámico
  const tiempoMaximo = 3;
  const [tiempoAlcanzado, setTiempoAlcanzado] = useState(false);
  const [pelotaImage, setPelotaImage] = useState(null);

  // Estado para animación de ficha comida
  const [animatingPiece, setAnimatingPiece] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  const {
    getCellCoords,
    getClientPos,
    draw
  } = useGame(
    controller,
    canvasRef,
    dragging,
    cellSize,
    setCellSize,
    dragPos,
    dragOffset,
    animatingPiece,
    animationProgress
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
    cantFichas,
    iniciarCronometro,
    detenerCronometro,
    //getRandomImage
  )

  // function getRandomImage(onLoad) {
  //   const pelotaImages = [pelotaImg, pelotaImg2, pelotaImg3, pelotaImg4, pelotaImg5];
  //   const img = new Image();
  //   img.src = pelotaImages[Math.floor(Math.random() * pelotaImages.length)];
  //   img.onload = () => {
  //     setPelotaImage(img);
  //     if (onLoad) onLoad(img);
  //   };

  // }

  //init
  useEffect(() => {
    const imagenes = [pelotaImg, pelotaImg2, pelotaImg3, pelotaImg4, pelotaImg5].map(src => {
      return new Promise((resolve) => {
        const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // fallback
      img.src = src;
        
      })
    });
  
    Promise.all(imagenes).then((imagenes) => {
    const imagenesValidas = imagenes.filter(img => img !== null);

    const tablero = new Tablero(9, 9, imagenesValidas);
    const ctrl = new GameController(
      tablero,
      () => draw(ctrl),
      (fichaEliminada) => animateEatenPiece(fichaEliminada)
    );

    setController(ctrl);
    draw(ctrl);
    iniciarCronometro();
  });
  }, [cellSize]);

 useEffect(() => {
  if (!showInstructions && controller) {
    // Solo dibujamos cuando se cierran las instrucciones
    draw(controller);
  }
}, [showInstructions, controller]);


  // Tiempo máximo
  useEffect(() => {
    if (!levelTimer.corriendo || tiempoAlcanzado) return;
    const minutos = parseInt(formatearTiempo(levelTimer.tiempo).minutos);
    if (minutos >= tiempoMaximo) {
      setTiempoAlcanzado(true);
      detenerCronometro();
      setTimeout(() => {
        toast.error("Tiempo máximo alcanzado, reiniciando...");
        handleRestart([pelotaImg, pelotaImg2, pelotaImg3, pelotaImg4, pelotaImg5])
      }, 200);
    }
  }, [levelTimer.tiempo]);


  //Checkear si usuario gano o perdio
  useEffect(() => {
    let pierde = usuarioPierde()
    console.log("usuario pierde:", pierde)
    if (pierde) {
      toast.error("No quedan movimientos! Reiniciando...")
      setTimeout(() => {
        handleRestart()
      }, 2000)
    } else if (fichasRestantes === 1 && usuarioGana()) {
      toast.success("Has ganado el juego! Reiniciando...")
      setTimeout(() => {
        handleRestart()
      }, 3000)
    }
  }, [fichasRestantes])

  const usuarioPierde = () => {
    if (controller) {
      console.log("usuario pierde?")
      return controller.usuarioPierde()
    }
    return false;
  }

  const usuarioGana = () => {
    if (controller) {
      console.log("usuario gana?")
      return controller.usuarioGana()
    }
  }

  const toggleInstructions = () => {
    const detener = !showInstructions
    if(detener){
      detenerCronometro()
    } else {
      //deberia haber una funcion reanudarCronometro
      iniciarCronometro()
    }
    setShowInstructions(!showInstructions)
  }

  // Función para animar la ficha comida
  const animateEatenPiece = (ficha) => {
    if (!ficha) return;
    setAnimatingPiece(ficha);
    setAnimationProgress(0);

    const duration = 500; // 500ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatingPiece(null);
        setAnimationProgress(0);
      }
    };

    requestAnimationFrame(animate);
  };


return (
  <>
    {!showInstructions ? (
      <>
        {/* CRONÓMETRO */}
        <div className="cronometro-peg">
          <div>
            Tiempo: {formatearTiempo(levelTimer.tiempo).minutos}:
            {formatearTiempo(levelTimer.tiempo).segundos}
          </div>
          <div>Máximo: {tiempoMaximo} min</div>
          {tiempoAlcanzado && (
            <div style={{ color: "red", fontWeight: "bold" }}>
              ¡TIEMPO AGOTADO!
            </div>
          )}
        </div>

        {/* TOAST */}
        <Toaster
          position="top-center"
          containerStyle={{
            position: "absolute",
            top: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            width: "300px",
          }}
          toastOptions={{
            style: {
              background: "#0b1116",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "8px",
              padding: "10px 16px",
              textAlign: "left",
            },
            duration: 2000,
          }}
        />

        {/* CANVAS DEL JUEGO */}
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
              touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          />
        </div>

        {/* INFORMACIÓN Y BOTONES */}
        <div className="peg-info">
          <p>Fichas restantes: {fichasRestantes}</p>
          <button className="reset" onClick={handleRestart}>
            Reiniciar
          </button>
        </div>

        <button className="reset instructions-peg" onClick={toggleInstructions}>
          Instrucciones
        </button>
      </>
    ) : (
      <>
        <div className="instructions-overlay">
          <h2>Instrucciones</h2>
          <ul>
            <li> Mueve las fichas saltando sobre otras para eliminarlas.</li>
            <li>El objetivo es dejar una sola ficha en el centro.</li> 
            <li>Tenés <strong>{tiempoMaximo} minutos</strong> antes de que se reinicie el juego. </li>
          </ul>
          <button className="reset" onClick={toggleInstructions}>
            Volver al juego
          </button>
        </div>
      </>
    )}
  </>
);

}
