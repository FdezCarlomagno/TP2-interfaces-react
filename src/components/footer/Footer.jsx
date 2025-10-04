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
            <h2>EVENTOS</h2>
            <ul>
              <li>Summer Game Fest</li>
              <li>GameCon</li>
              <li>Gamescon</li>
              <li>E3</li>
            </ul>
          </div>

          <div className="footer-col">
            <h2>GAMEHUB</h2>
            <ul>
              <li>Inicio</li>
              <li>Biblioteca</li>
              <li>Sobre Nosotros</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>

          <div className="footer-col">
            <h2>REPORTAR ERRORES</h2>
            <ul>
              <li>Reportar un problema</li>
              <li>Denunciar</li>
              <li>Asistencia legal</li>
              <li>Términos y condiciones</li>
            </ul>
          </div>
        </div>
        {/* Redes Sociales */}
        <div className="footer-bottom">
             {/* Contacto */}
          <div className="footer-contact">
            <button>Contactanos</button>
            <p>+54 249 4 254 454</p>
          </div>

          <h2>REDES SOCIALES</h2>
          <div className="social-icons">
            <img src="/icons/instagram.svg" alt="Instagram" />
            <img src="/icons/tiktok.svg" alt="TikTok" />
            <img src="/icons/facebook.svg" alt="Facebook" />
            <img src="/icons/twitter.svg" alt="Twitter" />
            <img src="/icons/linkedin.svg" alt="LinkedIn" />
          </div>
       
        </div>


      </div>


    </footer>
  );
}
