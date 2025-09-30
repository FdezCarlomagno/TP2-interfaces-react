
import LoginForm from "../components/login/loginForm"
import Logo from '../assets/logo.svg';
import {Link} from 'react-router-dom'

import Footer from '../components/footer/Footer';

export default function LoginPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <Link to={"/"}><img src={Logo} alt="GAMEHUB" style={{ height: 50 }} /></Link>
        <button className="register-btn"><strong>Registrarse</strong></button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <LoginForm />
      </main>

      {/* Footer */}
    </div>
  )
}
