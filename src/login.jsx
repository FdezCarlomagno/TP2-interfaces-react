
import { LoginForm } from "./components/login/loginForm"
import Logo from './assets/logo.svg';

import Footer from './components/footer/Footer';

export default function LoginPage() {
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <img src={Logo} alt="GAMEHUB" style={{ height: 50 }} />
        <button className="register-btn">Registrarse</button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <LoginForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
