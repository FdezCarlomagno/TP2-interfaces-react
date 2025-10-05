import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import GenericGameScreen from "../components/gameScreen/GenericGameScreen"
import ReusableGamesCarousel from "../components/carruseles/carrusel/reusable.carrusel"
import GameDetails from "../components/gameDetails/GameDetails"
import GameGrid from "../components/GameGrid/GameGrid"

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
      <GameDetails game={gameInfo}></GameDetails>

           <ReusableGamesCarousel
            title="Shooters"
            imageSize="medium"
            startIndex={27}
            endIndex={35}
          ></ReusableGamesCarousel>
          <ReusableGamesCarousel
            title="Deportes"
            imageSize="medium"
            startIndex={36}
            endIndex={43}
          ></ReusableGamesCarousel>
          <ReusableGamesCarousel
            title="Accion"
            imageSize="medium"
            startIndex={44}
            endIndex={53}
          ></ReusableGamesCarousel>
          <ReusableGamesCarousel
            title="Terror"
            imageSize="medium"
            startIndex={54}
            endIndex={63}
          ></ReusableGamesCarousel>
          <ReusableGamesCarousel
            title="Estrategia"
            imageSize="medium"
            startIndex={64}
            endIndex={72}
          ></ReusableGamesCarousel>
          <ReusableGamesCarousel
            title="Casuales"
            imageSize="medium"
            startIndex={73}
            endIndex={80}
          ></ReusableGamesCarousel>
    </>
  )
}

export default Game
