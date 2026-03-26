import React from 'react';
import './LogInPage.css';

const LogInPage: React.FC = () => {
  return (
    <div className="log-in-page">
      {/* Main Content */}
      <main className="log-in-main">
        <section className="log-in-card">
          <div className="log-in-content">
            <h1 className="log-in-title">Log In</h1>

            <form className="log-in-form">
              {/* Usuario */}
              <div className="log-in-form-group">
                <label htmlFor="username" className="log-in-label">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  className="log-in-input"
                  placeholder="Usuario"
                />
              </div>

              {/* Contraseña */}
              <div className="log-in-form-group">
                <label htmlFor="password" className="log-in-label">
                  Contraseña
                </label>
                <div className="log-in-password-wrapper">
                  <input
                    id="password"
                    type="password"
                    className="log-in-input"
                    placeholder="Contraseña"
                  />
                  <span className="log-in-password-icon">🔒</span>
                </div>
              </div>

              {/* Options */}
              <div className="log-in-options">
                <label className="log-in-remember">
                  <input type="checkbox" />
                  <span>recuerda mi contraseña</span>
                </label>

                <button type="button" className="log-in-forgot">
                  olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit */}
              <button type="submit" className="log-in-button">
                Log In
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LogInPage;