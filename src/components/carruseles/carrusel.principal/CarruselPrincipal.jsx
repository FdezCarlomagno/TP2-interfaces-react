"use client"

import { useState, useEffect } from "react"
import { VideogamesService } from "../../../api/VideogamesService"
import "./carruselPrincipal.css"

const VideogamesCarousel = () => {
  const [games, setGames] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const videogamesService = new VideogamesService()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await videogamesService.fetchVideogames()
        if (data && !data.message) {
          setGames(data.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  const nextSlide = () => {
    if (isTransitioning || games.length === 0) return

    setIsTransitioning(true)
    // Move by one item, but consider the visible items (2.5)
    const maxIndex = Math.max(0, games.length - 3) // Show last 3 items at most
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
      <div className="carousel-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando videojuegos...</p>
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="carousel-container">
        <div className="error-message">
          <p>No se pudieron cargar los videojuegos</p>
        </div>
      </div>
    )
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button
          className="carousel-button carousel-button-prev"
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

        <div className="carousel-slides">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentIndex * 33.333}%)`,
              transition: isTransitioning ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
            }}
          >
            {games.map((game, index) => (
              <div key={game.id} className="carousel-slide">
                <div className="game-card">
                  <img
                    src={game.background_image || "/placeholder.svg"}
                    alt={game.name}
                    className="game-image"
                    loading="lazy"
                  />
                  <div className="game-overlay">
                    <div className="game-info">
                      <h3 className="game-title">{game.name}</h3>
                      <div className="game-meta">
                        <span className="game-rating">★ {game.rating}</span>
                        <span className="game-year">{new Date(game.released).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-button carousel-button-next"
          onClick={nextSlide}
          disabled={isTransitioning || currentIndex >= Math.max(0, games.length - 3)}
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

      <div className="carousel-indicators">
        {Array.from({ length: Math.max(1, games.length - 2) }, (_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  )
}

export default VideogamesCarousel
