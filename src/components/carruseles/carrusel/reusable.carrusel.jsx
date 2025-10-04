"use client"

import { useState } from "react"
import { useAppContext } from "../../../context/AppContext"
import "./reusable.carrusel.css"
import { useNavigate } from "react-router-dom"

const ReusableGamesCarousel = ({
  title = "Juegos",
  imageSize = "medium",
  startIndex = 0,
  endIndex = 10,
}) => {
  const { games: allGames, loading, setSelectedGame } = useAppContext() // juegos del contexto
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const nav = useNavigate()

  const handleClick = (game) => {

    setSelectedGame({
      gameInfo: game,
      isPremium: isPremiumGame(game.id)
    })
    nav(`/${game.id}`)
  }

  // Seleccionamos solo el rango de juegos que corresponde
  const games = allGames.slice(startIndex, Math.min(endIndex, allGames.length))

  const isPremiumGame = (gameId) => gameId % 5 < 2

  const getImageSizeClass = () => {
    switch (imageSize) {
      case "small":
        return "reusable-carousel-image-small"
      case "large":
        return "reusable-carousel-image-large"
      default:
        return "reusable-carousel-image-medium"
    }
  }

  const handleImageError = (gameId) => {
    setImageErrors((prev) => ({ ...prev, [gameId]: true }))
  }

  const nextSlide = () => {
    if (isTransitioning || games.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, games.length - 5)
      return prevIndex >= maxIndex ? 0 : prevIndex + 1
    })
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning || games.length === 0) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, games.length - 5)
      return prevIndex <= 0 ? maxIndex : prevIndex - 1
    })
    setTimeout(() => setIsTransitioning(false), 500)
  }

  if (loading) {
    return (
      <div className="reusable-carousel-container">
        <h3 className="reusable-carousel-title">{title}</h3>
        <div className="reusable-carousel-loading">
          <div className="reusable-loading-spinner"></div>
          <p>Cargando juegos...</p>
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="reusable-carousel-container">
        <h3 className="reusable-carousel-title">{title}</h3>
        <div className="reusable-carousel-error">
          <p>No se pudieron cargar los juegos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reusable-carousel-container">
      <h3 className="reusable-carousel-title">{title}</h3>

      <div className="reusable-carousel-wrapper">
        <button
          className="reusable-carousel-nav-btn carousel-nav-left"
          onClick={prevSlide}
          disabled={isTransitioning}
          aria-label="Juego anterior"
        >
          <svg className="reusable-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="reusable-carousel-games-container">
          <div
            className={`reusable-carousel-games-track ${isTransitioning ? "transitioning" : ""}`}
            style={{ transform: `translateX(-${currentIndex * 20}%)` }}
          >
            {games.map((game) => {
              const isPremium = isPremiumGame(game.id)
              const hasImageError = imageErrors[game.id]

              return (
                <div key={game.id} className="reusable-game-card">
                  <div className="reusable-game-image-container" onClick={() => handleClick(game)}>
                    {!hasImageError ? (
                      <img
                        src={game.background_image_low_res || "/placeholder.svg"}
                        alt={game.name}
                        className={`reusable-game-image ${getImageSizeClass()}`}
                        onError={() => handleImageError(game.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div className={`reusable-game-image-fallback ${getImageSizeClass()}`}>
                        <div className="reusable-fallback-icon">🎮</div>
                        <p>Imagen no disponible</p>
                      </div>
                    )}

                    <div className="reusable-game-hover-overlay">
                      {isPremium ? (
                        <div className="reusable-premium-lock-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <circle cx="12" cy="16" r="1" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                      ) : (
                        <div className="reusable-play-icon">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="reusable-game-info">
                    <h4 className="reusable-game-name">
                      {game.name}
                      {isPremium && (
                        <span className="reusable-premium-crown" title="Juego Premium">
                          👑
                        </span>
                      )}
                    </h4>
                    {isPremium && <p className="reusable-premium-text">Premium - No disponible</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button
          className="reusable-carousel-nav-btn carousel-nav-right"
          onClick={nextSlide}
          disabled={isTransitioning}
          aria-label="Siguiente juego"
        >
          <svg className="reusable-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ReusableGamesCarousel
