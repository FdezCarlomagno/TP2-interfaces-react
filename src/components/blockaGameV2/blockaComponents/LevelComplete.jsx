
export default function LevelComplete({ levelTime, hidden }) {
  if (hidden) return null

  return (
    <div className="blocka-win">
      ¡Nivel completado! 🎉
      <div className="level-time">
        Tiempo: {levelTime.minutos}:{levelTime.segundos}.{levelTime.centesimas}
      </div>
    </div>
  )
}