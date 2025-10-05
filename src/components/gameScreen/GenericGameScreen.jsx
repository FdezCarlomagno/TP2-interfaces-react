import { useLocation } from "react-router-dom";
import PegSolitaire from "../pegSolitaire/PegSolitaire";

const GenericGameScreen = ({game, isPremium}) => {
  const location = useLocation();

  if (location.pathname === "/peg") {
    return <PegSolitaire/>;
  }
 
  return (
    <>


    <div className="pantalla-juego flex gap-4 justify-center flex-wrap">
        <h1>
        {game.name} {isPremium && <span>(Es premium)</span>}
      </h1>
      <p>{game.description}</p>

        <img
          src={game.background_image_low_res}
          alt="Imagen de fondo"
          className="w-64 h-40 object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300"
        />
    </div>
    </>
  );
}

export default GenericGameScreen
