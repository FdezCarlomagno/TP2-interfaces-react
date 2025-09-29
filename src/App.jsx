import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header/Header'
import Dashboard from './components/dashboard/Dashboard'
import CarruselPrincipal from './components/carruseles/carrusel.principal/CarruselPrincipal'
import ReusableGamesCarousel from './components/carruseles/carrusel/reusable.carrusel'
import OfertaDelMes from './components/ofertaDelMes/OfertaDelMes'
import Footer from './components/footer/Footer'

function App() {
  return (
    <>
     <Header/>
     <Dashboard />
     <div className='appBody'>
        <h1>GAMEHUB.COM</h1>
        <p className='subtitleMain'>Todos tus juegos favoritos están acá</p>
        <main>
        <CarruselPrincipal />
         <div>
        {/* Popular games carousel - shows games 0-10 with medium images */}
        <ReusableGamesCarousel title="Populares" imageSize="large" startIndex={27} endIndex={37} />

        <OfertaDelMes />
        {/* New releases carousel - shows games 10-20 with large images */}
        <div>
          <ReusableGamesCarousel title="Nuevos Lanzamientos" imageSize="medium" startIndex={10} endIndex={20} />
        </div>

        {/* Recommended carousel - shows games 20-26 with small images */}
        <div>
          <ReusableGamesCarousel title="Recomendados" imageSize="medium" startIndex={20} endIndex={26} />
        </div>
      </div>
        </main>
      </div>
      <Footer/>
    </>
  )
}

export default App
