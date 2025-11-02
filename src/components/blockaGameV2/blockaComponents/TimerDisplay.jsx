export default function TimerDisplay({ time, maxTime, hidden }) {
  if (hidden) return null

  return (
    <div className="blocka-timer">
      <div className="timer-display">
        {time.minutos}:{time.segundos}.{time.centesimas}
      </div>
      <div className="timer-display">Máximo: {maxTime / 1000} Segundos</div>
    </div>
  )
}