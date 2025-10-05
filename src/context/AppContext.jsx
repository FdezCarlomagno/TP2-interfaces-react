/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { VideogamesService } from "../api/VideogamesService";
// 1) Crear el contexto
const AppContext = createContext();

// 2) Proveedor del contexto
export function AppProvider({ children }) {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
  // NOTE: we create the service inside the effect to avoid missing dependency warnings
    // Inicializar selectedGame desde localStorage si existe
    const getInitialSelectedGame = () => {
      try {
        const raw = localStorage.getItem('selectedGame')
        if (!raw) return { gameInfo: {}, isPremium: false }
        const parsed = JSON.parse(raw)
        // Validación mínima
        if (parsed && parsed.gameInfo) return parsed
        return { gameInfo: {}, isPremium: false }
      } catch (e) {
        console.warn('Error leyendo selectedGame desde localStorage', e)
        return { gameInfo: {}, isPremium: false }
      }
    }

    const [selectedGame, setSelectedGame] = useState(getInitialSelectedGame)

    // Sincronizar selectedGame con localStorage
    useEffect(() => {
      try {
        localStorage.setItem('selectedGame', JSON.stringify(selectedGame))
      } catch (e) {
        console.warn('No se pudo guardar selectedGame en localStorage', e)
      }
    }, [selectedGame])

    useEffect(() => {
      const videogamesService = new VideogamesService()
      const fetchGames = async () => {
        try {
          const data = await videogamesService.fetchVideogames()
          if (data && !data.message) {
            setGames(data)
          }
        } catch (error) {
          console.error("Error fetching games:", error)
        } finally {
          setLoading(false)
        }
      }

      fetchGames()
    }, [])

    return (
        <AppContext.Provider value={{ games, setGames, loading, setLoading, selectedGame, setSelectedGame }}>
            {children}
        </AppContext.Provider>
    );
}

// 3) Custom hook para usar el contexto más fácil
export function useAppContext() {
    return useContext(AppContext);
}
