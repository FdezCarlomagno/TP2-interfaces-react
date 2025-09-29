import '../header/header.css'
import SearchBar from '../searchBar/SearchBar'
import Logo from '../../assets/logo.svg'
import Avatar from '../../assets/avatar.png'
import { useAppContext } from "../../context/AppContext"  // 👈 importamos el contexto

const Header = () => {
  const { games } = useAppContext() // 👈 traemos del contexto

  return (
    <nav className="navbar">
      <ul>
        {/* Logo */}
        <li className='logoGamehub'>
          <img src={Logo} alt="GAMEHUB" />
        </li>

        {/* SearchBar */}
        <li>
            <SearchBar games={games} />
        </li>

        {/* Avatar perfil */}
        <li className='logoPerfil'>
          <img src={Avatar} alt="Perfil" />
        </li>
      </ul>
    </nav>
  )
}

export default Header
