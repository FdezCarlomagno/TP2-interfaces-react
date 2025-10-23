
const Controls = ({ game }) => {
    return <>
            {/* Right side with game image and controls */}
      <div className="details-right">
        <div className="game-image-container">
          <img
            src={game.background_image_low_res || game.background_image}
            alt={game.name}
            className="details-game-image"
          />
        </div>

        <div className="controls-section">
          <h3 className="controls-title">Controles</h3>
          <div className="controls-info">
            <p className="control-item">
              <span className="control-label">Movimiento de la imagen:</span>
              <span className="control-value">Mouse y click</span>
            </p>
          </div>

          <h3 className="actions-title">Acciones:</h3>
          <div className="actions-info">
            <p className="action-item">
              <span className="action-label">🖱️ Click izquierdo:</span> rota +90°
            </p>
            <p className="action-item">
              <span className="action-label">🖱️ Click derecho:</span> rota -90°
            </p>
             <p className="action-item">
              <span className="action-label">🎯 Completá la imagen</span> para pasar de nivel
            </p> 
          </div>
        </div>
      </div>
    </>
}

export default Controls