export default function GameControls({ onHelp, onInstructions, level, hidden, helpDisabled }) {
  return (
    <div className={`blocka-controls ayuda ${hidden ? "hidden" : ""}`}>
      <button onClick={onHelp} disabled={helpDisabled}>
        🔍 Ayuda
      </button>
      <span className="blocka-level">Nivel: {level}</span>
      <button onClick={onInstructions}>❔ Instrucciones</button>
    </div>
  )
}
