import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import ProfileMenu from "./components/profileMenu/profileMenu";
import CarruselPrincipal from './components/carruseles/carrusel.principal/CarruselPrincipal';
import ReusableGamesCarousel from './components/carruseles/carrusel/reusable.carrusel';
import OfertaDelMes from './components/ofertaDelMes/OfertaDelMes';
import Layout from './pages/Layout'
import Footer from './components/footer/Footer';

function Home() {
  return (
    <>
      <h1>GAMEHUB.COM</h1>
      <p className='subtitleMain'>Todos tus juegos favoritos están acá</p>
      <main>
        <CarruselPrincipal />
        <div>
          <ReusableGamesCarousel title="Populares" imageSize="large" startIndex={27} endIndex={37} />
          <OfertaDelMes />
          <ReusableGamesCarousel title="Nuevos Lanzamientos" imageSize="medium" startIndex={10} endIndex={20} />
          <ReusableGamesCarousel title="Recomendados" imageSize="medium" startIndex={20} endIndex={26} />
          <ReusableGamesCarousel title='Shooters' imageSize='medium' startIndex={27} endIndex={35}></ReusableGamesCarousel>
          <ReusableGamesCarousel title='Deportes' imageSize='medium' startIndex={36} endIndex={43}></ReusableGamesCarousel>
          <ReusableGamesCarousel title='Accion' imageSize='medium' startIndex={44} endIndex={53}></ReusableGamesCarousel>
          <ReusableGamesCarousel title='Terror' imageSize='medium' startIndex={54} endIndex={63}></ReusableGamesCarousel>
          <ReusableGamesCarousel title='Estrategia' imageSize='medium' startIndex={64} endIndex={72}></ReusableGamesCarousel>
          <ReusableGamesCarousel title='Casuales' imageSize='medium' startIndex={73} endIndex={80}></ReusableGamesCarousel>
        </div>
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con Layout fijo */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Podés meter más páginas aquí y solo cambia el <Outlet /> */}
        </Route>

        {/* Rutas sin Layout (ej: login independiente) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
