import LoginForm from "../components/login/loginForm"
import Logo from '../assets/logo.svg';
import {Link, useNavigate} from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <Link to={"/"}><img src={Logo} alt="GAMEHUB" style={{ height: 50 }} /></Link>
        <button className="register-btn" onClick={() => navigate("/register")}> <strong>Registrarse</strong> </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <LoginForm />
      </main>
    </div>
  )
}
