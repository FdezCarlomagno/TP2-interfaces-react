import { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import GenericGameScreen from "../components/gameScreen/GenericGameScreen";
import ReusableGamesCarousel from "../components/carruseles/carrusel/reusable.carrusel";
import GameDetails from "../components/gameDetails/GameDetails";
import GameGrid from "../components/GameGrid/GameGrid";
import pegImg from "../assets/imgs/Messi.png";
import CommentsSection from "../components/CommentSection/CommentsSection";
import "./Game.css";
import BlockaGame from "../components/blockaGame/BlockaGame";
import GameplayCarousel from "../components/carruseles/gameplayCarousel/GameplayCarousel";
import blockaFondo from "../assets/imgs/blockaFondo.jpg";
import Controls from "../components/gameDetails/Controls";
import Sombra from "../components/sombra/Sombra";
import flappyImg from '../assets/imgs/flappy.png';

const Game = () => {
  const { gameId } = useParams();
  const { selectedGame, setSelectedGame, games, loading } = useAppContext();
  const location = useLocation();

  // ---------- JUEGO PEG ----------
  const peg = {
    id: "peg",
    name: "Peg Solitaire",
    background_image_low_res: pegImg,
    background_image: pegImg,
    rating: 4.5,
    released: "2023-01-01",
    genres: [{ name: "Casual" }, { name: "Puzzle" }],
    description:
      "Peg Solitaire es un juego de lógica donde debes eliminar fichas saltando sobre otras hasta dejar solo una.",
    platforms: [{ platform: { name: "Web" } }],
    publishers: [{ name: "GameHub" }],
    developers: [{ name: "GameHub Devs" }],
    tags: [{ name: "Lógica" }, { name: "Estrategia" }],
    screenshots: [{ image: "/peg1.jpg" }, { image: "/peg2.jpg" }],
    movies: [{ data: { max: "/peg-trailer.mp4" } }],
  };

  // ---------- JUEGO BLOCKA ----------
  const blocka = {
    id: "blocka",
    name: "Blocka Game",
    background_image_low_res: blockaFondo,
    background_image: blockaFondo,
    rating: 4.5,
    released: "2023-01-01",
    genres: [{ name: "Casual" }, { name: "Puzzle" }],
    description:
      "Blocka Game es un puzzle donde armás una imagen moviendo cuatro piezas desordenadas. Cada nivel aumenta la dificultad con filtros visuales que complican la percepción.",
    platforms: [{ platform: { name: "Web" } }],
    publishers: [{ name: "GameHub" }],
    developers: [{ name: "GameHub Devs" }],
    tags: [{ name: "Puzzle" }, { name: "Estrategia" }],
    screenshots: [{ image: "/blocka1.jpg" }, { image: "/blocka2.jpg" }],
    movies: [{ data: { max: "/blocka-trailer.mp4" } }],
  };

  // ---------- JUEGO FLAPPY BIRD (INFO REAL) ----------
  const flappyBird = {
    id: "flappy-bird",
    name: "Flappy Bird",
    background_image_low_res: flappyImg,
    background_image: flappyImg,
    rating: 4.0,
    released: "2013-05-24",
    genres: [{ name: "Arcade" }, { name: "Casual" }],
    description:
      "Flappy Bird es un juego arcade creado por Dong Nguyen. Controlás un pájaro que debe atravesar huecos entre tuberías sin chocar. Su dificultad extrema lo volvió viral en 2014.",
    platforms: [
      { platform: { name: "iOS" } },
      { platform: { name: "Android" } },
      { platform: { name: "Web" } },
    ],
    publishers: [{ name: "dotGears" }],
    developers: [{ name: "Dong Nguyen" }],
    tags: [
      { name: "Arcade" },
      { name: "Difícil" },
      { name: "Reflejos" },
      { name: "Retro" },
    ],
    screenshots: [{ image: "/flappy1.jpg" }, { image: "/flappy2.jpg" }],
    movies: [{ data: { max: "/flappy-trailer.mp4" } }],
    website: "https://flappybird.io",
  };

  // ---------- RECONSTRUIR SELECTED GAME SI FALTA ----------
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

  if (loading) return <p>Cargando juego...</p>;

  // ---------- SWITCH POR PATHNAME ----------
  const path = location.pathname;

  const renderGame = () => {
    switch (path) {
      case "/juegos/peg":
        return (
          <>
            <div className="game-top-layout">
              <div className="game-media">
                <GenericGameScreen game={peg} isPremium={false} />
                <div className="gameplay-under-media">
                  <GameplayCarousel game="peg" />
                </div>
              </div>
              <aside className="game-grid-side">
                <Controls game={peg} />
              </aside>
            </div>

            <div className="details-comments-layout">
              <div className="details-main">
                <GameDetails game={peg} />
              </div>
            </div>

            <div className="comments-grid">
              <CommentsSection />
              <GameGrid count={12} />
            </div>
          </>
        );

      case "/juegos/blocka":
        return (
          <>
            <div className="game-top-layout">
              <div className="game-media">
                <GenericGameScreen game={blocka} isPremium={false} />
                <div className="gameplay-under-media">
                  <GameplayCarousel />
                </div>
              </div>
              <aside className="game-grid-side">
                <Controls game={blocka} />
              </aside>
            </div>

            <div className="details-comments-layout">
              <div className="details-main">
                <GameDetails game={blocka} />
              </div>
            </div>

            <div className="comments-grid">
              <CommentsSection />
              <GameGrid count={12} />
            </div>
          </>
        );

      case "/juegos/flappy-bird":
        return (
          <>
            <div className="game-top-layout">
              <div className="game-media">
                <GenericGameScreen game={flappyBird} isPremium={false} />
                <div className="gameplay-under-media">
                  <GameplayCarousel game="flappyBird" />
                </div>
              </div>
              <aside className="game-grid-side">
                <Controls game={flappyBird} />
              </aside>
            </div>

            <div className="details-comments-layout">
              <div className="details-main">
                <GameDetails game={flappyBird} />
              </div>
            </div>

            <div className="comments-grid">
              <CommentsSection />
              <GameGrid count={12} />
            </div>
          </>
        );

      default:
        if (!selectedGame || !selectedGame.gameInfo) {
          return <p>No hay juego seleccionado</p>;
        }

        return (
          <>
            <div className="game-top-layout">
              <div className="game-media">
                <GenericGameScreen
                  game={selectedGame.gameInfo}
                  isPremium={selectedGame.isPremium}
                />
                <div className="gameplay-under-media">
                  <GameplayCarousel />
                </div>
              </div>
              <aside className="game-grid-side">
                <Controls game={selectedGame.gameInfo} />
              </aside>
            </div>

            <div className="details-comments-layout">
              <div className="details-main">
                <GameDetails game={selectedGame.gameInfo} />
              </div>
            </div>

            <div className="comments-grid">
              <CommentsSection />
              <GameGrid count={12} />
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Sombra side="right" pos="100% 0%" offset="0px" />
      {renderGame()}

      {/* Carruseles */}
      <ReusableGamesCarousel
        title="Shooters"
        imageSize="medium"
        startIndex={27}
        endIndex={35}
      />
      <ReusableGamesCarousel
        title="Deportes"
        imageSize="medium"
        startIndex={36}
        endIndex={43}
      />
      <ReusableGamesCarousel
        title="Accion"
        imageSize="medium"
        startIndex={44}
        endIndex={53}
      />
      <ReusableGamesCarousel
        title="Terror"
        imageSize="medium"
        startIndex={54}
        endIndex={63}
      />
      <ReusableGamesCarousel
        title="Estrategia"
        imageSize="medium"
        startIndex={64}
        endIndex={72}
      />
      <ReusableGamesCarousel
        title="Casuales"
        imageSize="medium"
        startIndex={73}
        endIndex={80}
      />
    </>
  );
};

export default Game;
