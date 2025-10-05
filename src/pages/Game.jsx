import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import GenericGameScreen from "../components/gameScreen/GenericGameScreen"

const Game = () => {
  const { gameId } = useParams()
  const { selectedGame, setSelectedGame, games, loading } = useAppContext()

  // Si no hay selectedGame, intentar reconstruirlo desde la lista de games usando el id de la ruta
  useEffect(() => {
    if ((!selectedGame || !selectedGame.gameInfo || !selectedGame.gameInfo.id) && games.length > 0 && gameId) {
      const found = games.find((g) => String(g.id) === String(gameId))
      if (found) {
        setSelectedGame({ gameInfo: found, isPremium: found.id % 5 < 2 })
      }
    }
  }, [gameId, games, selectedGame, setSelectedGame])

  if (loading) return <p>Cargando juego...</p>

  if (!selectedGame || !selectedGame.gameInfo || !selectedGame.gameInfo.id) {
    return <p>No hay juego seleccionado</p>
  }

  const isPremium = selectedGame.isPremium
  const { gameInfo } = selectedGame

  return (
    <>
      {/* Pantalla del juego con imágenes */}
      <GenericGameScreen game={gameInfo} isPremium={isPremium} />
    </>
  )
}

export default Game
