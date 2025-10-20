"use client"

import { useState } from "react"
// import { BrowserRouter, Routes, Route } from "react-router-dom"  //no soportado x gh pages
import { HashRouter, Routes, Route } from "react-router-dom"; //soportado x gh pages

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
import './App.css'
import GameGrid from "./components/GameGrid/GameGrid";

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

        {/**
         * Dentro de este componente se puede setear la cantidad de imagenes que se muestran
         * 
         *Lo mejor es no pasarse de 7 porque sino queda feo
         */}
        <CarruselPrincipal />

        {/* GameGrid visible solo en mobile bajo el hero */}
        <div className="home-mobile-only">
          <GameGrid />
        </div>

        <div>

          {/* *
          A este carrusel le podes setear desde què juegoempezar para que no se repitan juegos

          Si los profes nos piden cambiar la cantidad que se muestran tocamos estas props aca

          Start index : desde que juego empieza a iterar el videogame list
          End Index: hasta que videojuego llega

          La cantidad de videojuegos mostrados es de endIndex - startIndex + 1
          */}
          <ReusableGamesCarousel title="Populares" imageSize="large" startIndex={27} endIndex={37} />
          <OfertaDelMes />

          {/* GameGrid visible solo en mobile debajo de Oferta del Mes */}
          <div className="home-mobile-only">
            <GameGrid />
          </div>

          <ReusableGamesCarousel title="Nuevos Lanzamientos" imageSize="medium" startIndex={10} endIndex={20} />
          <ReusableGamesCarousel title="Recomendados" imageSize="medium" startIndex={20} endIndex={26} />
          <GameHubSection></GameHubSection>

          {/* GameGrid visible solo en mobile debajo de Cross-Platform */}
          <div className="home-mobile-only">
            <GameGrid />
          </div>
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
  /**
   * Estado para setear el lodaer del principio al inicar en home
   */
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <GameLoader onLoadComplete={handleLoadComplete} />}

      <HashRouter>
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
            {/* Aca se pueden meter mas rutas en un futuro */}
          </Route>

          {/* Rutas sin Layout (ej: login independiente, registro) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />

        </Routes>
        {/* Footer que siempre se renderiza */}
        <Footer />
      </HashRouter>
    </>
  )
}

export default App
