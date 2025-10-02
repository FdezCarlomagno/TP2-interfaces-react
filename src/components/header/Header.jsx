import '../header/header.css'
import SearchBar from '../searchBar/SearchBar'
import Logo from '../../assets/logo.svg'
import Avatar from '../../assets/avatar.png'
import { useAppContext } from "../../context/AppContext"
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import ProfileMenu from '../profileMenu/profileMenu'

const Header = () => {
  const { games } = useAppContext()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const avatarRef = useRef(null)
  const menuRef = useRef(null)

  // Cerrar el menú si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false)
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  return (
    <nav className="navbar">
      {showProfileMenu && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 1500
        }} />
      )}
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
        <li className={`logoPerfil${showProfileMenu ? ' profile-menu-open' : ''}`} ref={avatarRef} style={{ position: 'relative' }}>
          <img
            src={Avatar}
            alt="Perfil"
            style={{ cursor: 'pointer' }}
            onClick={() => setShowProfileMenu((v) => !v)}
          />
          {showProfileMenu && (
            <div ref={menuRef} style={{ position: 'absolute', top: 50, right: 0, zIndex: 2000 }}>
              <ProfileMenu />
            </div>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Header
