import '../header/header.css'
import SearchBar from '../searchBar/SearchBar'
import Logo from '../../assets/logo.svg'
import Avatar from '../../assets/avatar.png'
const Header = () => {
    return <>
        <nav className="navbar">
            <ul>
                {/**
                 * Aca va el logo de gamehub
                */}
                <li className='logoGamehub'>
                    <img src={Logo} alt="GAMEHUB" />
                </li>
                 {/**
                 * Aca va la navbar
                */}
                <li>
                    <SearchBar></SearchBar>
                </li>
                 {/**
                 * Aca el icono del perfil
                */}
                <li className='logoPerfil'>
                    <img src={Avatar} alt="Perfil" />
                </li>
            </ul>
        </nav>
    </>
}

export default Header