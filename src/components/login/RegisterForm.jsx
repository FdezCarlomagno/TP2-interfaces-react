import { useState } from "react"
import "../login/loginForm.css"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"

export default function RegisterForm() {
  const [form, setForm] = useState({
    nombre: "",
    username: "",
    edad: "",
    email: "",
    password: "",
    repeatPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [captchaValue, setCaptchaValue] = useState(null)
  const navigate = useNavigate()

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.nombre) newErrors.nombre = "Ingrese su nombre y apellido"
    if (!form.username) newErrors.username = "Ingrese un nombre de usuario"
    if (!form.edad || isNaN(form.edad) || form.edad < 1) newErrors.edad = "Ingrese una edad válida"
    if (!form.email || !validateEmail(form.email)) newErrors.email = "Ingrese un email válido"
    if (!form.password || form.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    if (form.password !== form.repeatPassword) newErrors.repeatPassword = "Las contraseñas no coinciden"
    if (!captchaValue) newErrors.captcha = "Confirme que no es un robot"
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      // Aquí iría la lógica de registro
      alert("¡Registro exitoso!")
    }
  }

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h3 className="form-title">Registrarse</h3>
          <div className="form-group">
            <label className="form-label">Nombre y apellido *</label>
            <input
              type="text"
              className={`form-input ${errors.nombre ? "error" : ""}`}
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingrese su nombre y apellido..."
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2, marginRight: 8 }}>
              <label className="form-label">Username</label>
              <input
                type="text"
                className={`form-input ${errors.username ? "error" : ""}`}
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Ingrese su nombre de usuario..."
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Edad</label>
              <input
                type="number"
                className={`form-input ${errors.edad ? "error" : ""}`}
                name="edad"
                value={form.edad}
                onChange={handleChange}
                placeholder="Edad"
                min="1"
              />
              {errors.edad && <span className="error-text">{errors.edad}</span>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="text"
              className={`form-input ${errors.email ? "error" : ""}`}
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ingrese su Email..."
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Contraseña *</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-input ${errors.password ? "error" : ""}`}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Ingrese su contraseña..."
              />
              <button type="button" className="eye-icon" onClick={() => setShowPassword((v) => !v)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Repetir contraseña *</label>
            <div className="password-wrapper">
              <input
                type={showRepeatPassword ? "text" : "password"}
                className={`form-input ${errors.repeatPassword ? "error" : ""}`}
                name="repeatPassword"
                value={form.repeatPassword}
                onChange={handleChange}
                placeholder="Repita la contraseña..."
              />
              <button type="button" className="eye-icon" onClick={() => setShowRepeatPassword((v) => !v)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            {errors.repeatPassword && <span className="error-text">{errors.repeatPassword}</span>}
          </div>
          <div className="form-group" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Google test key
              onChange={setCaptchaValue}
            />
            {errors.captcha && <span className="error-text" style={{ marginTop: 8 }}>{errors.captcha}</span>}
          </div>
          <p className="register-text">
            ¿Ya tenés una cuenta? <a href="#" className="register-link" onClick={e => {e.preventDefault(); navigate("/login")}}><strong>Iniciá sesión</strong></a>
          </p>
          <button type="submit" className="submit-btn">
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  )
}
