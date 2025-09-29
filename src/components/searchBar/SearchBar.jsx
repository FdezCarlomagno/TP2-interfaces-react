import { useState } from 'react'
import '../searchBar/searchBar.css'

const SearchBar = ({ games }) => {
  const [search, setSearch] = useState("")

  // Filtrar juegos según el texto buscado
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  )

  const showDropdown = search !== ""
  const hasResults = filteredGames.length > 0

  return (
    <div className="searchBar">
      <div className="searchInputWrapper">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showDropdown && (
        <ul className="dropdown">
          {hasResults ? (
            filteredGames.map((game) => (
              <li key={game.id} className="dropdown-item">
                <img src={game.background_image} alt={game.name} />
                <div>
                  <h4>{game.name}</h4>
                  <p>
                    ⭐ {game.rating} | {game.released.split("-")[0]} |{" "}
                    {game.genres.map(g => g.name).join(", ")}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <li className="dropdown-item no-results">
              <p>No se encontraron juegos 🎮</p>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
