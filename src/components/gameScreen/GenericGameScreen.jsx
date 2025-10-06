import { useLocation } from "react-router-dom";
import { useState } from "react";
import PegSolitaire from "../pegSolitaire/PegSolitaire";
import './GameScreen.css'
import gamehubLogo from '../../assets/logo.svg'

const GenericGameScreen = ({game, isPremium}) => {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false)

  
 
return (
    <div className="game-screen">
      {/* Background with blur */}
      <div className="game-background" style={{ backgroundImage: `url(${game.background_image_low_res})` }}></div>

      {/* Main content */}
      <div className="game-content">
        {!isPlaying ? (
          <>
            <div className="game-card">
              <img src={game.background_image_low_res || "/placeholder.svg"} alt={game.name} className="game-card-image" />
              <h2 className="game-title">{game.name}</h2>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className={`action-button ${isPremium ? "premium" : "play"}`}
                onClick={() => setIsPlaying(true)}
              >
                {isPremium ? "Subscribirse" : "Jugar"}
              </button>
              <button
                className="action-button"
                style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.06)', color: 'white' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Ver Detalles
              </button>
            </div>
          </>
        ) : (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="action-button"
                style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.06)', color: 'white' }}
                onClick={() => setIsPlaying(false)}
              >
                Cerrar
              </button>
            </div>
            <div className="game-play-area">
              {location.pathname.includes('/juegos/peg') &&<PegSolitaire />}
            </div>
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="control-bar">
        <div className="control-left">
          <img src={gamehubLogo} alt="" />
          <span className="game-name">{game.name}</span>
        </div>

        <div className="control-right">
          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span className="control-count">100</span>
          </button>

          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
            </svg>
          </button>

          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>

          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>

          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"></path>
            </svg>
          </button>

          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
          </button>

          <button className="control-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenericGameScreen
