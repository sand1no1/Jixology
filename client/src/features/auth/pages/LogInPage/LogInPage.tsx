import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import AuthCardLayout from '@/shared/components/AuthCardLayout';
import './LogInPage.css';

export default function LogInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthCardLayout>
      <div className="log-in-page">
        <h1 className="log-in-page__title">Iniciar sesión</h1>

        <form className="log-in-page__form">
          <div className="log-in-page__form-group">
            <label htmlFor="email" className="log-in-page__label">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="log-in-page__input"
              placeholder="Ingresa tu correo electrónico"
              autoComplete="email"
              required
            />
          </div>

          <div className="log-in-page__form-group">
            <label htmlFor="password" className="log-in-page__label">
              Contraseña
            </label>

            <div className="log-in-page__password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="log-in-page__input log-in-page__input--password"
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="log-in-page__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="log-in-page__eye-icon" />
                ) : (
                  <EyeIcon className="log-in-page__eye-icon" />
                )}
              </button>
            </div>
          </div>

          <div className="log-in-page__options">
            <button type="button" className="log-in-page__forgot">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="log-in-page__button">
            Iniciar sesión
          </button>
        </form>
      </div>
    </AuthCardLayout>
  );
}