import RegisterForm from "../components/login/RegisterForm";
import Logo from '../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom'
import { useCallback } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const goToLogin = useCallback(() => navigate("/login"), [navigate]);
  return (
    <div className="page-container">
      {/* Header */}
      <header className="header">
        <Link to={"/"}><img src={Logo} alt="GAMEHUB" style={{ height: 50 }} /></Link>
        <button className="register-btn" onClick={goToLogin}><strong>Iniciar sesión</strong></button>
      </header>
      {/* Main Content */}
      <main className="main-content">
        <RegisterForm />
      </main>
    </div>
  )
}
