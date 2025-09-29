import "./Footer.css";
import Logo from '../../assets/logo.svg';

export default function Footer() {
  return (
    <footer className="footer">
         <div className="footer-logo">
          <img src={Logo} alt="Gamehub Logo" />
        </div>
      <div className="footer-top">       

        {/* Columnas */}
        <div className="footer-columns">
          <div className="footer-col">
            <h3>EVENTOS</h3>
            <ul>
              <li>Summer Game Fest</li>
              <li>GameCon</li>
              <li>Gamescon</li>
              <li>E3</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>GAMEHUB</h3>
            <ul>
              <li>Inicio</li>
              <li>Biblioteca</li>
              <li>Sobre Nosotros</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>REPORTAR ERRORES</h3>
            <ul>
              <li>Reportar un problema</li>
              <li>Denunciar</li>
              <li>Asistencia legal</li>
              <li>Términos y condiciones</li>
            </ul>
          </div>
        </div>

        {/* Contacto */}
        <div className="footer-contact">
          <button>Contactanos</button>
          <p>+54 249 4 254 454</p>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="footer-bottom">
        <h3>REDES SOCIALES</h3>
        <div className="social-icons">
          <img src="/icons/instagram.svg" alt="Instagram" />
          <img src="/icons/tiktok.svg" alt="TikTok" />
          <img src="/icons/facebook.svg" alt="Facebook" />
          <img src="/icons/twitter.svg" alt="Twitter" />
          <img src="/icons/linkedin.svg" alt="LinkedIn" />
        </div>
      </div>
    </footer>
  );
}
