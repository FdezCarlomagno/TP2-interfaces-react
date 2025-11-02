export default function GameComplete({ totalTime }) {
  return (
    <div className="blocka-final">
      ¡Juego completado! 🏆 Reiniciando...
      <div className="total-time">
        Tiempo total: {totalTime.minutos}:{totalTime.segundos}
      </div>
    </div>
  )
}