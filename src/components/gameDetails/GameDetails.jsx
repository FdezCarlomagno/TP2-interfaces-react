import "./GameDetails.css";
import GameGrid from "../GameGrid/GameGrid";

const GameDetails = ({ game, descriptionLimit = 1000 }) => {
  if (!game) return null;

  // Format date to Spanish format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const getSpanishDescription = (description) => {
    if (!description) return "";

    const spanishMarker = "Español";
    const spanishIndex = description.indexOf(spanishMarker);

    let text = description;
    if (spanishIndex !== -1) {
      text = description.substring(spanishIndex + spanishMarker.length).trim();
    }

    // Limit characters
    if (text.length > descriptionLimit) {
      return text.substring(0, descriptionLimit).trim() + "…";
    }

    return text;
  };

  const createBreadcrumbs = () => {
    const crumbs = ["Juegos"];
    if (game.genres && game.genres.length > 0) crumbs.push(game.genres[0].name);
    crumbs.push(game.name);
    return crumbs;
  };

  const breadcrumbs = createBreadcrumbs();

  return (
    <div className="game-details">
      <div className="details-left">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb}
              {index < breadcrumbs.length - 1 && " >> "}
            </span>
          ))}
        </div>

        {/* Title and Share button */}
        <div className="details-header">
          <h1 className="details-title">{game.name}</h1>
          <button className="share-button">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Compartir
          </button>
        </div>

        {/* Game info */}
        <div className="game-info">
          <div className="info-item">
            <span className="info-label">Puntaje:</span>
            <span className="info-value">{game.rating}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Lanzamiento:</span>
            <span className="info-value">{formatDate(game.released)}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Plataformas:</span>
            <span className="info-value">
              {game.platforms.map((p) => p.name).join(", ")}
            </span>
          </div>
        </div>

        {/* Genre tags */}
        {game.genres && game.genres.length > 0 && (
          <div className="genre-tags">
            {game.genres.map((genre, idx) => (
              <button key={genre.id ?? genre.name ?? idx} className="genre-tag">
                {genre.name}
              </button>
            ))}
          </div>
        )}

        {/* Description */}
        {game.description && (
          <div className="game-description">
            <h3>
              <strong>Descripción:</strong>
            </h3>
            <p>{getSpanishDescription(game.description)}</p>
          </div>
        )}
      </div>

      {/* Right side with game image and controls */}
      <div className="details-right">
        <div className="game-image-container">
          <img
            src={game.background_image_low_res || game.background_image}
            alt={game.name}
            className="details-game-image"
          />
        </div>

        <div className="controls-section">
          <h3 className="controls-title">Controles</h3>
          <div className="controls-info">
            <p className="control-item">
              <span className="control-label">Movimiento de la ficha:</span>
              <span className="control-value">Mouse y click</span>
            </p>
          </div>

          <h3 className="actions-title">Acciones:</h3>
          <div className="actions-info">
            <p className="action-item">
              <span className="action-label">Click:</span> seleccionar la ficha
              Messi o confirmar un salto
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GameDetails;
