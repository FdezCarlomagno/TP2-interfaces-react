export default function Instructions({ onClose }) {
  return (
    <div className="blocka-instructions-overlay" onClick={onClose}>
      <div className="blocka-instructions" onClick={(e) => e.stopPropagation()}>
        <h3>🧩 Cómo jugar Blocka Messi</h3>
        <ul>
          <li>
            Haz <strong>clic izquierdo</strong> sobre un cuadrante para girarlo 90° a la derecha.
          </li>
          <li>
            Haz <strong>clic derecho</strong> para girarlo a la izquierda.
          </li>
          <li>
            Tu objetivo es <strong>armar correctamente</strong> la imagen de Messi.
          </li>
          <li>
            Usa el botón <strong>🔍 Ayuda</strong> si te atascas (¡pero agrega +5 segundos!).
          </li>
          <li>Completa todos los niveles lo más rápido posible.</li>
        </ul>
        <button className="instructions-close" onClick={onClose}>
          ✖ Cerrar
        </button>
      </div>
    </div>
  )
}