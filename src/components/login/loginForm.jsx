"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./loginForm.css"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="login-card">
      <div className="login-header">
        <h1 className="login-title">Iniciar sesión</h1>
      </div>
      <div className="login-content">
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="felizcarneagner@fumba.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input password-input"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="oauth-buttons">
            <button type="button" className="oauth-btn google-btn">
              <span className="oauth-icon">🔍</span>
              Continuar con Google
            </button>

            <button type="button" className="oauth-btn github-btn">
              <span className="oauth-icon">🐙</span>
              Continuar con Github
            </button>
          </div>

          {/* Register Link */}
          <div className="register-link">
            <span className="register-text">¿Todavía no tenés cuenta? </span>
            <Link href="/register" className="register-anchor">
              Regístrate
            </Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
