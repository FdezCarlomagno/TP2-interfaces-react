import { createContext, useContext, useState, useEffect } from "react";
import { VideogamesService } from "../api/VideogamesService";
// 1) Crear el contexto
const AppContext = createContext();

// 2) Proveedor del contexto
export function AppProvider({ children }) {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const videogamesService = new VideogamesService()

      useEffect(() => {
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
        <AppContext.Provider value={{ games, setGames, loading, setLoading }}>
            {children}
        </AppContext.Provider>
    );
}

// 3) Custom hook para usar el contexto más fácil
export function useAppContext() {
    return useContext(AppContext);
}
