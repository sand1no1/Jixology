import { useEffect, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import AuthCardLayout from '@/shared/components/AuthCardLayout';
import {supabase} from '@/core/supabase/supabase.client';
import './LogInPage.css';

type DevBypassSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
  isDevBypass: true;
};

const DEV_BYPASS_ENABLED = import.meta.env.VITE_ENABLE_DEV_BYPASS === 'true';
const DEV_BYPASS_EMAIL =
  import.meta.env.VITE_DEV_BYPASS_EMAIL || 'test@local.dev';
const DEV_BYPASS_PASSWORD =
  import.meta.env.VITE_DEV_BYPASS_PASSWORD || '123456';

export default function LogInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error checking session:', error.message);
          return;
        }

        const supabaseSession = data.session;
        const devSession = sessionStorage.getItem('dev_bypass_session');

        if (supabaseSession) {
          console.log('Supabase JWT found:', supabaseSession.access_token);
          // redirect or update global auth state here
          // window.location.href = '/dashboard';
          return;
        }

        if (devSession) {
          const parsed: DevBypassSession = JSON.parse(devSession);
          console.log('Dev bypass session found:', parsed.access_token);
          // redirect or update global auth state here
          // window.location.href = '/dashboard';
        }
      } catch (err) {
        console.error('Unexpected session check error:', err);
      }
    };

    checkExistingSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        console.log('Auth changed, JWT:', session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createDevBypassSession = (): DevBypassSession => {
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 8;

    return {
      access_token: 'dev-bypass-jwt-token',
      refresh_token: 'dev-bypass-refresh-token',
      expires_at: expiresAt,
      user: {
        id: 'dev-user-001',
        email: DEV_BYPASS_EMAIL,
        role: 'admin',
      },
      isDevBypass: true,
    };
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      // DEV BYPASS
      if (
        DEV_BYPASS_ENABLED &&
        normalizedEmail === DEV_BYPASS_EMAIL.toLowerCase() &&
        password === DEV_BYPASS_PASSWORD
      ) {
        const devSession = createDevBypassSession();
        sessionStorage.setItem('dev_bypass_session', JSON.stringify(devSession));

        setInfo('Inicio de sesión con usuario de prueba.');
        console.log('Dev bypass session:', devSession);

        // redirect or update global auth state here
        // window.location.href = '/dashboard';
        return;
      }

      // REAL SUPABASE LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session) {
        throw new Error('No se recibió una sesión válida.');
      }

      console.log('Supabase session:', data.session);
      console.log('JWT access token:', data.session.access_token);
      console.log('Authenticated user:', data.user);

      setInfo('Inicio de sesión exitoso.');

      // redirect or update global auth state here
      // window.location.href = '/dashboard';
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Ocurrió un error al iniciar sesión.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfo('');

    if (!email.trim()) {
      setError('Primero ingresa tu correo electrónico para recuperar la contraseña.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      setInfo('Se envió el correo de recuperación.');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo enviar el correo.';
      setError(message);
    }
  };

  return (
    <AuthCardLayout>
      <div className="log-in-page">
        <h1 className="log-in-page__title">Iniciar sesión</h1>

        <form className="log-in-page__form" onSubmit={handleLogin}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="log-in-page__password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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
            <button
              type="button"
              className="log-in-page__forgot"
              onClick={handleForgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && <p className="log-in-page__message log-in-page__message--error">{error}</p>}
          {info && <p className="log-in-page__message log-in-page__message--success">{info}</p>}

          <button type="submit" className="log-in-page__button" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          {DEV_BYPASS_ENABLED && (
            <div className="log-in-page__dev-note">
              <strong>Modo prueba:</strong> {DEV_BYPASS_EMAIL} / {DEV_BYPASS_PASSWORD}
            </div>
          )}
        </form>
      </div>
    </AuthCardLayout>
  );
}