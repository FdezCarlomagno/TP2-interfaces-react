"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "../../../context/AppContext"
import "./carruselPrincipal.css"
import { useNavigate } from "react-router-dom"

const VideogamesCarousel = () => {
  const { games: contextGames, loading, setSelectedGame } = useAppContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState('right')
  const [itemsToShow, setItemsToShow] = useState(1) // Mobile first: 1 item
  const games = contextGames.slice(0, 8)
  const nav = useNavigate()

  // Responsive items calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(2.5) // Desktop: 2.5 items
      } else if (window.innerWidth >= 768) {
        setItemsToShow(2) // Tablet: 2 items
      } else {
        setItemsToShow(1) // Mobile: 1 item
      }
    }

    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const nextSlide = () => {
    if (isTransitioning || games.length === 0) return

    setIsTransitioning(true)
    setSlideDirection('right')
    const maxIndex = Math.max(0, games.length - itemsToShow)
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, maxIndex))

    setTimeout(() => setIsTransitioning(false), 600)
  }

  const prevSlide = () => {
    if (isTransitioning || games.length === 0) return

    setIsTransitioning(true)
    setSlideDirection('left')
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0))

    setTimeout(() => setIsTransitioning(false), 600)
  }

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return

    setIsTransitioning(true)
    setSlideDirection(index > currentIndex ? 'right' : 'left')
    const maxIndex = Math.max(0, games.length - itemsToShow)
    setCurrentIndex(Math.min(index, maxIndex))
    setTimeout(() => setIsTransitioning(false), 600)
  }

  // Calculate translateX percentage based on items to show
  const getTranslateX = () => {
    if (itemsToShow === 1) return `-${currentIndex * 100}%`
    if (itemsToShow === 2) return `-${currentIndex * 50}%`
    return `-${currentIndex * 33.333}%` // For 2.5 items
  }

  // Efecto para añadir clase de animación a los slides
  useEffect(() => {
    const slides = document.querySelectorAll('.main-carousel-slide')
    slides.forEach((slide, index) => {
      slide.classList.remove('slide-in-right', 'slide-in-left', 'slide-3d')
      
      if (isTransitioning) {
        if (slideDirection === 'right') {
          slide.classList.add('slide-in-right')
        } else {
          slide.classList.add('slide-in-left')
        }
        
        if (Math.random() > 0.7) {
          slide.classList.add('slide-3d')
        }
      }
    })
  }, [currentIndex, isTransitioning, slideDirection])

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

  const handleClick = (game) => {
    setSelectedGame({
      gameInfo: game,
      isPremium: false
    })
    nav(`juegos/${game.id}`)
  }

  const maxIndicatorIndex = Math.max(0, games.length - itemsToShow)

  return (
    <div className="main-carousel-container">
      <div className="main-carousel-wrapper">
        <button
          className="main-carousel-button main-carousel-button-prev"
          onClick={prevSlide}
          disabled={isTransitioning || currentIndex === 0}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            className={`main-carousel-track ${isTransitioning ? 'transitioning' : ''}`}
            style={{
              transform: `translateX(${getTranslateX()})`,
              transition: isTransitioning
                ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none",
            }}
          >
            {games.map((game, index) => (
              <div 
                key={game.id} 
                className="main-carousel-slide"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="main-game-card" onClick={() => handleClick(game)}>
                  <img
                    src={game.background_image_low_res || "/placeholder.svg"}
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
            isTransitioning || currentIndex >= maxIndicatorIndex
          }
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
        {Array.from({ length: maxIndicatorIndex + 1 }, (_, index) => (
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