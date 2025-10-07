import "./Footer.css";
import Logo from '../../assets/logo.svg';
import facebook from '../../assets/redes/facebook.svg'
import instagram from '../../assets/redes/instagram.svg'
import tiktok from '../../assets/redes/tiktok.svg'
import linkedin from '../../assets/redes/linkedin.svg'
import twitter from '../../assets/redes/twitter.svg'



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
            <img src={instagram} alt="Instagram" />
            <img src={tiktok} alt="TikTok" />
            <img src={facebook} alt="Facebook" />
            <img src={twitter} alt="Twitter" />
            <img src={linkedin} alt="LinkedIn" />
          </div>
       
        </div>


      </div>


    </footer>
  );
}
