"use client"

import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./pages/login"
import RegisterPage from "./pages/register"
import CarruselPrincipal from "./components/carruseles/carrusel.principal/CarruselPrincipal"
import ReusableGamesCarousel from "./components/carruseles/carrusel/reusable.carrusel"
import OfertaDelMes from "./components/ofertaDelMes/OfertaDelMes"
import Layout from "./pages/Layout"
import Footer from "./components/footer/Footer"
import GameLoader from "./components/GameLoader/GameLoader"
import GameHubSection from './components/GameHubSection/GameHubSection'
import { Toaster } from "react-hot-toast"
import Game from "./pages/Game"
import TagSection from "./components/TagSection/TagSection"

function Home() {
  return (
    <>
    <div className="title-main-section">
      <div>
        <h1>GAMEHUB.COM</h1>
        <p className="subtitleMain">Todos tus juegos favoritos están acá</p>
      </div>
        {/**SECCION DE TAGS*/}
        <TagSection></TagSection>
      </div>
      <main>
        <CarruselPrincipal />
        <div>
          <ReusableGamesCarousel title="Populares" imageSize="large" startIndex={27} endIndex={37} />
          <OfertaDelMes />
          <ReusableGamesCarousel title="Nuevos Lanzamientos" imageSize="medium" startIndex={10} endIndex={20} />
          <ReusableGamesCarousel title="Recomendados" imageSize="medium" startIndex={20} endIndex={26} />
          <GameHubSection></GameHubSection>
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
        </div>
      </main>
    </>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <GameLoader onLoadComplete={handleLoadComplete} />}

      <BrowserRouter>
        {/* Toaster global */}
        <Toaster
          toastOptions={{
            style: {
              background: "#0e121d",
              color: "#6d9bff",
              border: "1px solid #6d9bff"
            },
          }}
        />
        <Routes>
          {/* Rutas con Layout fijo */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="juegos/:gameId" element={<Game />} />
            {/* Podés meter más páginas aquí y solo cambia el <Outlet /> */}
          </Route>

          {/* Rutas sin Layout (ej: login independiente) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
