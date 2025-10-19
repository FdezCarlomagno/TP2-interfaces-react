import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import GenericGameScreen from "../components/gameScreen/GenericGameScreen";
import ReusableGamesCarousel from "../components/carruseles/carrusel/reusable.carrusel";
import GameDetails from "../components/gameDetails/GameDetails";
import GameGrid from "../components/GameGrid/GameGrid";
import { useLocation } from "react-router-dom";
import pegImg from "../assets/imgs/Messi.png";
import CommentsSection from "../components/CommentSection/CommentsSection";
import "./Game.css";
import BlockaGame from "../components/blockaGame/BlockaGame";

const Game = () => {
  /**
   * Aca viene por url el gameId
   */
  const { gameId } = useParams();

  /**
   *
   * Nos traemos todo lo necesario del contexto
   */
  const { selectedGame, setSelectedGame, games, loading } = useAppContext();

  // Si no hay selectedGame, intentar reconstruirlo desde la lista de games usando el id de la ruta
  useEffect(() => {
    if (
      (!selectedGame || !selectedGame.gameInfo || !selectedGame.gameInfo.id) &&
      games.length > 0 &&
      gameId
    ) {
      const found = games.find((g) => String(g.id) === String(gameId));
      if (found) {
        setSelectedGame({ gameInfo: found, isPremium: found.id % 5 < 2 });
      }
    }
  }, [gameId, games, selectedGame, setSelectedGame]);

  const location = useLocation();

  //feedbacka visual
  if (loading) return <p>Cargando juego...</p>;

  if (
    (!selectedGame || !selectedGame.gameInfo || !selectedGame.gameInfo.id) &&
    location.pathname !== "/juegos/peg"
  ) {
    return <p>No hay juego seleccionado</p>;
  }

  //setea todos los detalles del juego especifico del messi solitaire porque este juego no viene de la api
  const isPremium = selectedGame.isPremium;
  const { gameInfo } = selectedGame;
  const peg = {
    id: "peg",
    name: "Peg Solitaire",
    background_image_low_res: pegImg,
    background_image: pegImg,
    rating: 4.5,
    released: "2023-01-01",
    genres: [{ name: "Casual" }, { name: "Puzzle" }],
    description:
      "Peg Solitaire es un juego de lógica y estrategia en el que el objetivo es eliminar todas las fichas del tablero excepto una, moviendo las fichas saltando sobre otras. El juego comienza con un tablero lleno de fichas, excepto por una posición vacía. El jugador debe planificar sus movimientos cuidadosamente para lograr el objetivo final.",
    platforms: [{ platform: { name: "Web" } }],
    publishers: [{ name: "GameHub" }],
    developers: [{ name: "GameHub Devs" }],
    tags: [{ name: "Lógica" }, { name: "Estrategia" }, { name: "Un jugador" }],
    screenshots: [
      { image: "/peg-screenshot1.jpg" },
      { image: "/peg-screenshot2.jpg" },
    ],
    movies: [{ data: { max: "/peg-trailer.mp4" } }],
    website: "https://example.com/peg-solitaire",
    background_image_additional: "/peg-background2.jpg",
  };

  const blocka = {
    id: "blocka",
    name: "blocka game",
    background_image_low_res: pegImg,
    background_image: pegImg,
    rating: 4.5,
    released: "2023-01-01",
    genres: [{ name: "Casual" }, { name: "Puzzle" }],
    description:
      "Peg Solitaire es un juego de lógica y estrategia en el que el objetivo es eliminar todas las fichas del tablero excepto una, moviendo las fichas saltando sobre otras. El juego comienza con un tablero lleno de fichas, excepto por una posición vacía. El jugador debe planificar sus movimientos cuidadosamente para lograr el objetivo final.",
    platforms: [{ platform: { name: "Web" } }],
    publishers: [{ name: "GameHub" }],
    developers: [{ name: "GameHub Devs" }],
    tags: [{ name: "Lógica" }, { name: "Estrategia" }, { name: "Un jugador" }],
    screenshots: [
      { image: "/peg-screenshot1.jpg" },
      { image: "/peg-screenshot2.jpg" },
    ],
    movies: [{ data: { max: "/peg-trailer.mp4" } }],
    website: "https://example.com/peg-solitaire",
    background_image_additional: "/peg-background2.jpg",
  };
  return (
    <>
      {/* Pantalla del juego con imágenes */}
      {location.pathname === "/juegos/peg" ? (
        <>
          {/* Si el usuario eligio para jugar el peg solitarie se navega a esa url y se muestran los siguientes componentes */}
          <div className="game-top-layout">
            <div className="game-media">
              <GenericGameScreen game={peg} isPremium={false} />
            </div>
            <aside className="game-grid-side">
              <GameGrid count={16} />
            </aside>
          </div>
          <div className="details-comments-layout">
            <div className="details-main">
              <GameDetails game={peg} />
            </div>
            <aside className="comments-side">
              <h2>Comentarios</h2>
              <CommentsSection />
            </aside>
          </div>
        </>
      ) : location.pathname === "/juegos/blocka" ? (
        <>
          <div className="game-top-layout">
            <div className="game-media">
              <GenericGameScreen game={peg} isPremium={false} />
            </div>
          <aside className="game-grid-side">
            <GameGrid count={16} />
          </aside>
          </div>
          <GameDetails game={peg} />
        </>
      ) : (
        <>
          {/* Si el usuario eligio otro juego que no es el  messi solitaire se muestra aquel juego que eligio */}
          <div className="game-top-layout">
            <div className="game-media">
              <GenericGameScreen game={gameInfo} isPremium={isPremium} />
            </div>
            <aside className="game-grid-side">
              <GameGrid count={16} />
            </aside>
          </div>
          <div className="details-comments-layout">
            <div className="details-main">
              <GameDetails game={gameInfo} />
            </div>
            <aside className="comments-side">
              <h2>Comentarios</h2>
              <CommentsSection />
            </aside>
          </div>
          
        </>
      )}
      {/* Carruseles con demas juegos, misma funcionalidad que los que estan en App.jsx */}
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
  );
};

export default Game;
