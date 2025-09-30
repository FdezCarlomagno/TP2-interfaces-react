"use client"

import { useState } from "react"
import { useAppContext } from "../../../context/AppContext" // ajusta la ruta según tu estructura
import "./carruselPrincipal.css"

const VideogamesCarousel = () => {
  const { games : contextGames, loading } = useAppContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const games = contextGames.slice(0, 6)

  const nextSlide = () => {
    if (isTransitioning || games.length === 0) return

    setIsTransitioning(true)
    const maxIndex = Math.max(0, games.length - 3) // Mostrar hasta los últimos 3
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))

    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning || games.length === 0) return

    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))

    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return

    setIsTransitioning(true)
    const maxIndex = Math.max(0, games.length - 3)
    setCurrentIndex(Math.min(index, maxIndex))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  if (loading) {
    return (
      <div className="main-carousel-container">
        <div className="main-loading-spinner">
          <div className="main-spinner"></div>
          <p>Cargando videojuegos...</p>
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="main-carousel-container">
        <div className="main-error-message">
          <p>No se pudieron cargar los videojuegos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="main-carousel-container">
      <div className="main-carousel-wrapper">
        <button
          className="main-carousel-button main-carousel-button-prev"
          onClick={prevSlide}
          disabled={isTransitioning || currentIndex === 0}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="main-carousel-slides">
          <div
            className="main-carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 33.333}%)`,
              transition: isTransitioning
                ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
            }}
          >
            {games.slice(0, 6).map((game) => (
              <div key={game.id} className="main-carousel-slide">
                <div className="main-game-card">
                  <img
                    src={game.background_image || "/placeholder.svg"}
                    alt={game.name}
                    className="main-game-image"
                    loading="lazy"
                  />
                  <div className="main-game-overlay">
                    <div className="main-game-info">
                      <h3 className="main-game-title">{game.name}</h3>
                      <div className="main-game-meta">
                        <span className="main-game-rating">★ {game.rating}</span>
                        <span className="main-game-year">
                          {new Date(game.released).getFullYear()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="main-carousel-button main-carousel-button-next"
          onClick={nextSlide}
          disabled={
            isTransitioning || currentIndex >= Math.max(0, games.length - 3)
          }
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="main-carousel-indicators">
        {Array.from({ length: Math.max(1, games.length - 2) }, (_, index) => (
          <button
            key={index}
            className={`main-indicator ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  )
}

export default VideogamesCarousel
