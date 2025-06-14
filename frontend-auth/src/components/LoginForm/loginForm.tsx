import React, { useState } from 'react';
import { login } from '../../utils/auth';
import { saveToken, saveSession } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import CustomSuccessModal from '../../components/Modal/CustomSuccessModal';
import CustomErrorModal from '../../components/Modal/CustomErrorModal';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const data = await login(email, password);
      
      // Guardar token y sesión
      saveToken(data.access_token);
      saveSession(data.access_token, data.user);
      
      // Mostrar mensaje de éxito
      setSuccessMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err: any) {
      console.error('Error en login:', err);
      
      // Determinar el mensaje de error apropiado
      let message = 'Error al iniciar sesión';
      
      if (err.response?.status === 401) {
        message = 'Correo electrónico o contraseña incorrectos';
      } else if (err.response?.status === 403) {
        message = 'Acceso denegado. Verifica tus credenciales';
      } else if (err.response?.status >= 500) {
        message = 'Error del servidor. Intenta más tarde';
      } else if (err.message) {
        message = err.message;
      } else if (!navigator.onLine) {
        message = 'Sin conexión a internet. Verifica tu conexión';
      }
      
      setErrorMessage(message);
      
      // Cerrar modal de error automáticamente después de 3 segundos
      setTimeout(() => {
        setErrorMessage('');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
 
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-header">
            <h2 className="login-title">Iniciar Sesión</h2>
            <p className="login-subtitle">Ingresa tus credenciales para acceder</p>
          </div>

          <div className="login-form-content">
            <div className="input-group">
              <label htmlFor="email" className="input-label">Correo Electrónico</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="login-input"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password" className="input-label">Contraseña</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="loading-spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Modales */}
      {errorMessage && (
        <CustomErrorModal
          message={"Intentenlo más tarde"}
          onClose={() => setErrorMessage('')}
          title="Error de Autenticación"
        />
      )}

      {successMessage && (
        <CustomSuccessModal
          message={successMessage}
          onClose={() => setSuccessMessage('')}
          title="¡Bienvenido!"
        />
      )}
    </div>
  );
};

export default LoginForm;