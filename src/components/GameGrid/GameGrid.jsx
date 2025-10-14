"use client"

import { useAppContext } from "../../context/AppContext"
import "./GameGrid.css"
import { useNavigate } from "react-router-dom"

const GameGrid = ({ count = 10 }) => {
  const { games: allGames, loading, setSelectedGame } = useAppContext()
  const nav = useNavigate()
  
   const isPremiumGame = (gameId) => gameId % 5 < 2

 
  const handleSelect = (game) => {
    setSelectedGame({
      gameInfo: game,
      isPremium: isPremiumGame(game.id)
    })
    nav(`../juegos/${game.id}`, { replace: false })
  }

  if (loading) {
    return (
      <div className="game-grid-wrapper">
        <div className="game-grid-loading">Cargando juegos...</div>
      </div>
    )
  }

  const displayedGames = allGames.slice(0, count)

  return (
    <div className="game-grid-wrapper">
      <div className="game-grid">
        {displayedGames.map((game) => (
          <div
            key={game.id}
            className="game-card-grid"
            onClick={() => handleSelect(game)}
          >
            <img
              src={game.background_image_low_res || "/placeholder.svg"}
              alt={game.name}
              className="game-card-image"
            />
            <div className="game-card-title">{game.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameGrid
