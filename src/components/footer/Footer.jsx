import "./Footer.css";
import Logo from '../../assets/logo.svg';
import facebook from '../../assets/redes/facebook.svg';
import instagram from '../../assets/redes/instagram.svg';
import tiktok from '../../assets/redes/tiktok.svg';
import linkedin from '../../assets/redes/linkedin.svg';
import twitter from '../../assets/redes/twitter.svg';

export default function Footer() {
  return (
    <footer className="footer">
      {/* LOGO */}
      <div className="footer-logo">
        <img src={Logo} alt="Gamehub Logo" />
        <p>Tu portal gamer definitivo.</p>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="footer-grid">
        <div className="footer-col">
          <h2>JUEGOS POPULARES</h2>
          <ul>
            <li>Fortnite</li>
            <li>League of Legends</li>
            <li>Call of Duty</li>
            <li>GTA V</li>
            <li>Valorant</li>
            <li>Red Dead Redemption 2</li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>PLATAFORMAS</h2>
          <ul>
            <li>PC</li>
            <li>PlayStation</li>
            <li>Xbox</li>
            <li>Nintendo Switch</li>
            <li>Mobile</li>
            <li>VR</li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>LANZAMIENTOS 2025</h2>
          <ul>
            <li>Starfield II</li>
            <li>Hollow Knight: Silksong</li>
            <li>GTA VI</li>
            <li>Fable</li>
            <li>Dragon Age: Dreadwolf</li>
            <li>Avowed</li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>COMUNIDAD</h2>
          <ul>
            <li>Foros y Chats</li>
            <li>Reviews de usuarios</li>
            <li>Clanes y equipos</li>
            <li>Top streamers</li>
            <li>Eventos LAN</li>
            <li>Desafíos diarios</li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>NOTICIAS Y BLOG</h2>
          <ul>
            <li>Últimas noticias</li>
            <li>Reseñas y análisis</li>
            <li>Guías y tutoriales</li>
            <li>eSports</li>
            <li>Actualizaciones</li>
            <li>Colaboraciones</li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>AYUDA Y SOPORTE</h2>
          <ul>
            <li>Centro de ayuda</li>
            <li>Reportar un problema</li>
            <li>Términos y condiciones</li>
            <li>Privacidad</li>
            <li>Soporte técnico</li>
            <li>Contacto directo</li>
          </ul>
        </div>
      </div>

      {/* FOOTER SECUNDARIO */}
      <div className="footer-bottom">
        <div className="footer-contact">
          <h2>CONTACTO</h2>
          <p>+54 249 4 254 454</p>
          <p>info@gamehub.com</p>
          <button>Contactanos</button>
        </div>

        <div>
          <h2>REDES SOCIALES</h2>
          <div className="social-icons">
            <img src={instagram} alt="Instagram" />
            <img src={tiktok} alt="TikTok" />
            <img src={facebook} alt="Facebook" />
            <img src={twitter} alt="Twitter" />
            <img src={linkedin} alt="LinkedIn" />
          </div>
        </div>

        <div className="footer-newsletter">
          <h2>NEWSLETTER</h2>
          <p>Recibe novedades, lanzamientos y ofertas exclusivas.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Ingresa tu email" />
            <button>Suscribirse</button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-copy">
        <p>© 2025 GameHub. Todos los derechos reservados. — Powered by gamers ⚡</p>
      </div>
    </footer>
  );
}
