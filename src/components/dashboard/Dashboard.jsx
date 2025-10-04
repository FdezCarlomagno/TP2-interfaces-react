import '../dashboard/dashboard.css'
import home from '../../assets/home.svg'
import menu from '../../assets/menu.svg'
import cross from '../../assets/cross.svg'
import { useState } from 'react'
import ic_2players from '../../assets/dashboardItemsImg/ic_2players.svg'
import ic_accion from '../../assets/dashboardItemsImg/ic_accion.svg'
import ic_biblioteca from '../../assets/dashboardItemsImg/ic_biblioteca.svg'
import ic_carreras from '../../assets/dashboardItemsImg/ic_carreras.svg'
import ic_deAventura from '../../assets/dashboardItemsImg/ic_deAventura.svg'
import ic_deCartas from '../../assets/dashboardItemsImg/ic_deCartas.svg'
import ic_futbol from '../../assets/dashboardItemsImg/ic_futbol.svg'
import ic_nuevos from '../../assets/dashboardItemsImg/ic_nuevos.svg'
import ic_populares from '../../assets/dashboardItemsImg/ic_populares.svg'
import ic_puzzle from '../../assets/dashboardItemsImg/ic_puzzle.svg'
import ic_shooters from '../../assets/dashboardItemsImg/ic_shooters.svg'

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const items = [
    { src: ic_nuevos, name: "Nuevos" },
    { src: ic_populares, name: "Populares" },
    { src: ic_shooters, name: "Shooters" },
    { src: ic_2players, name: "2 Players" },
    { src: ic_accion, name: "Acción" },
    { src: ic_deCartas, name: "De Cartas" },
    { src: ic_deAventura, name: "Aventura" },
    { src: ic_carreras, name: "Carrera" },
    { src: ic_futbol, name: "Fútbol" },
  ]

  return (
    <div className={menuOpen ? 'dashboard open' : 'dashboard'}>
      {/* Botón de abrir/cerrar menú */}
      <DashboardItem
        src={menuOpen ? cross : menu}
        alt="menu"
        onClick={toggleMenu}
      />

      {/* Ítems principales */}
      <DashboardItem
        src={home}
        alt="home"
        name="Inicio"
        menuOpen={menuOpen}
      />
      <DashboardItem
        src={ic_biblioteca}
        alt="biblioteca"
        name="Biblioteca"
        menuOpen={menuOpen}
      />

      {/* Ítems del dashboard */}
      <div className="dashboard-items">
        {items.map((item, index) => (
          <DashboardItem
            key={index}
            src={item.src}
            alt={item.name}
            name={item.name}
            menuOpen={menuOpen}
          />
        ))}
      </div>
    </div>
  )
}

const DashboardItem = ({ src, alt, onClick, name = "", menuOpen }) => {
  return (
    <div className="dashboardItem" onClick={onClick}>
      <img src={src} alt={alt} />
      {menuOpen && <p>{name}</p>}
    </div>
  )
}

export default Dashboard
