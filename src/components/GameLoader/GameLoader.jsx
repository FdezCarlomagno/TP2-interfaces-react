"use client"

import { useState, useEffect } from "react"
import "./GameLoader.css"

function GameLoader({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simular carga progresiva de 0 a 100% en 5 segundos
    const duration = 5000 // 5 segundos
    const intervalTime = 50 // Actualizar cada 50ms
    const increment = (100 / duration) * intervalTime

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + increment

        if (newProgress >= 100) {
          clearInterval(interval)
          // Esperar un momento antes de completar para mostrar el 100%
          setTimeout(() => {
            onLoadComplete()
          }, 200)
          return 100
        }

        return newProgress
      })
    }, intervalTime)

    return () => clearInterval(interval)
  }, [onLoadComplete])

  return (
    <div className="game-loader-container">
      <div className="game-loader-content">
        {/* Logo o título */}
        <div className="game-loader-title">
          <h1 className="glitch" data-text="GAMEHUB">
            GAMEHUB
          </h1>
          <p className="game-loader-subtitle">LOADING EXPERIENCE</p>
        </div>

        {/* Spinner animado */}
        <div className="spinner-container">
          <div className="spinner-outer">
            <div className="spinner-inner"></div>
            <div className="spinner-core"></div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="progress-container">
          <div className="progress-bar-wrapper">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
              <div className="progress-bar-glow"></div>
            </div>
          </div>
          <div className="progress-text">
            <span className="progress-percentage">{Math.floor(progress)}%</span>
            <span className="progress-label">INITIALIZING SYSTEMS</span>
          </div>
        </div>

        {/* Elementos decorativos futuristas */}
        <div className="corner-decoration top-left"></div>
        <div className="corner-decoration top-right"></div>
        <div className="corner-decoration bottom-left"></div>
        <div className="corner-decoration bottom-right"></div>
      </div>
    </div>
  )
}

export default GameLoader
