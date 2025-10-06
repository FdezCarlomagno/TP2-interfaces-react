import { useState, useRef } from 'react'
import '../searchBar/searchBar.css'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const SearchBar = ({ games }) => {
  const [search, setSearch] = useState("")
  const nav = useNavigate()
  const { setSelectedGame } = useAppContext()
  // Filtrar juegos según el texto buscado
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  )
  
  const inputRef = useRef(null)

  const handleClick = (game) => {
    // setSelectedGame expects the same shape as other parts of the app
    try {
      setSelectedGame({ gameInfo: game, isPremium: game.id % 5 < 2 })
    } catch (e) {
      // fallback if setSelectedGame expects raw game
      setSelectedGame(game)
    }

    // Clear search to close dropdown and remove focus from the input
    setSearch("")
    if (inputRef.current) inputRef.current.blur()

    nav(`juegos/${game.id}`)
  }

  const showDropdown = search !== ""
  const hasResults = filteredGames.length > 0

  return (
    <div className="searchBar">
      <div className="searchInputWrapper">
        <input
          ref={inputRef}
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
              <li key={game.id} className="dropdown-item" onClick={() => handleClick(game)}>
                <img src={game.background_image_low_res} alt={game.name} />
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
