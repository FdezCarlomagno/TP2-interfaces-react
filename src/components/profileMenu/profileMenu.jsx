import "./profileMenu.css"
import Avatar from '../../assets/avatar.png'
import { useNavigate } from 'react-router-dom'

export default function ProfileMenu() {
  const navigate = useNavigate();
  return (
    <div className="profile-menu">
      <div className="profile-header">
        <div className="avatar" style={{ width: 56, height: 56, padding: 0 }}>
          <img
            src={Avatar}
            alt="Avatar"
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
        </div>
        <h2 className="username">@JUGADOR99</h2>
        <p className="email">Jugador99@gmail.com</p>
      </div>

      <div className="action-buttons">
        {/* Icono de usuario (perfil) */}
        <button className="icon-button" aria-label="Perfil" style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6d9bff" strokeWidth="2" style={{ width: 20, height: 20 }}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 16-4 16 0" />
          </svg>
        </button>
        {/* Icono de editar (lápiz) */}
        <button className="icon-button" aria-label="Editar" style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6d9bff" strokeWidth="2" style={{ width: 20, height: 20 }}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </button>
        {/* Icono de compartir (paper plane) */}
        <button className="icon-button" aria-label="Compartir" style={{ width: 40, height: 40 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6d9bff" strokeWidth="2" style={{ width: 20, height: 20 }}>
            <path d="M22 2L11 13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <div className="divider"></div>

      <nav className="menu-items">
        <button className="menu-item">
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span>Notificaciones</span>
        </button>
        <button className="menu-item">
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M12 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>Privacidad</span>
        </button>
        <button className="menu-item">
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
          </svg>
          <span>Configuración</span>
        </button>
        <button className="menu-item" onClick={() => navigate('/login')}>
          <svg className="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </nav>

      <div className="divider"></div>

      <button className="menu-item help-item">
        <svg
          className="menu-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
        <span>Ayuda</span>
      </button>
    </div>
  )
}
