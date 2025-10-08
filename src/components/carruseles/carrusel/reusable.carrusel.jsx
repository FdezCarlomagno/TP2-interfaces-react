"use client"

import { useState, useEffect, useRef } from "react"
import { useAppContext } from "../../../context/AppContext"
import "./reusable.carrusel.css"
import { useNavigate } from "react-router-dom"

const ReusableGamesCarousel = ({
  title = "Juegos",
  imageSize = "medium",
  startIndex = 0,
  endIndex = 10,
}) => {
  const { games: allGames, loading, setSelectedGame } = useAppContext()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const [slidesPerView, setSlidesPerView] = useState(1)
  const [slideMove, setSlideMove] = useState(0) // px to move per step
  const nav = useNavigate()

  const containerRef = useRef(null) // wrapper that masks the track
  const trackRef = useRef(null) // the flex track

  // selección de juegos según props
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

  // calcula slidesPerView con lógica mobile-first
  const calcSlidesPerView = (width) => {
    if (width < 480) return 1
    if (width >= 480 && width < 768) return 2
    if (width >= 768 && width < 1024) return 3
    return 5 // desktop >= 1024, 5 visibles (como deseabas)
  }

  // recalcula slideMove (px) usando el ancho real de la primera tarjeta + gap
  const computeSlideMove = () => {
    const track = trackRef.current
    if (!track) {
      setSlideMove(0)
      return
    }

    const firstCard = track.querySelector(".reusable-game-card")
    if (!firstCard) {
      setSlideMove(0)
      return
    }

    const cardRect = firstCard.getBoundingClientRect()
    // obtener gap del track (fallback 0)
    const style = window.getComputedStyle(track)
    const gap = parseFloat(style.gap || style.columnGap || 0) || 0

    // movimiento = ancho real de la tarjeta + gap
    setSlideMove(Math.round(cardRect.width + gap))
  }

  // on mount y resize -> recalcular slidesPerView y slideMove
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      const spv = calcSlidesPerView(w)
      setSlidesPerView(spv)
      // computeSlideMove depende del DOM, haremos un pequeño delay para asegurar renderizado
      setTimeout(() => computeSlideMove(), 50)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [games.length])

  // si slidesPerView o games cambian, asegurar currentIndex dentro de rango
  useEffect(() => {
    const maxIndex = Math.max(0, games.length - slidesPerView)
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
    // recompute slideMove por si cambió layout
    setTimeout(() => computeSlideMove(), 50)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidesPerView, games.length])

  const handleClick = (game) => {
    setSelectedGame({
      gameInfo: game,
      isPremium: isPremiumGame(game.id),
    })
    nav(`../juegos/${game.id}`, { replace: false })
  }

  const handleImageError = (gameId) => {
    setImageErrors((prev) => ({ ...prev, [gameId]: true }))
  }

  const nextSlide = () => {
    if (isTransitioning || games.length === 0 || slideMove === 0) return
    setIsTransitioning(true)

    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const totalWidth = track.scrollWidth
    const visibleWidth = container.offsetWidth

    // Máximo desplazamiento sin dejar hueco
    const maxTranslate = totalWidth - visibleWidth
    const currentTranslate = currentIndex * slideMove
    const nextTranslate = currentTranslate + slideMove

    // Si ya estamos al final o lo sobrepasaríamos → volver al principio
    if (nextTranslate >= maxTranslate - 2) {
      setCurrentIndex(0)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }

    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning || games.length === 0 || slideMove === 0) return
    setIsTransitioning(true)

    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const totalWidth = track.scrollWidth
    const visibleWidth = container.offsetWidth
    const maxTranslate = totalWidth - visibleWidth
    const currentTranslate = currentIndex * slideMove

    // Si estamos al principio → saltar al final exacto
    if (currentTranslate <= 0) {
      const lastIndex = Math.floor(maxTranslate / slideMove)
      setCurrentIndex(lastIndex)
    } else {
      setCurrentIndex((prev) => prev - 1)
    }

    setTimeout(() => setIsTransitioning(false), 500)
  }


  // Si loading / sin juegos
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

  // cálculo de estilo transform usando slideMove en px
  const trackStyle = {
    transform: `translateX(-${currentIndex * slideMove}px)`,
    transition: isTransitioning ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
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

        <div className="reusable-carousel-games-container" ref={containerRef}>
          <div
            className={`reusable-carousel-games-track ${isTransitioning ? "transitioning" : ""}`}
            ref={trackRef}
            style={trackStyle}
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
