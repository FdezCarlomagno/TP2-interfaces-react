import '../header/header.css'
import SearchBar from '../searchBar/SearchBar'

const Header = () => {
    return <>
        <nav className="navbar">
            <ul>
                {/**
                 * Aca va el logo de gamehub
                */}
                <li className='logoGamehub'>
                    <img src="src" alt="GAMEHUB" />
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
                    <img src="src" alt="Perfil" />
                </li>
            </ul>
        </nav>
    </>
}

export default Header