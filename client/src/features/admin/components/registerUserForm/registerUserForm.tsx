import type { RegisterUserFormValues } from '../types/admin.types';
import './registerUserForm.css';

type Props = {
  values: RegisterUserFormValues;
  loading: boolean;
  error: string;
  success: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function RegisterUserForm({
  values,
  loading,
  error,
  success,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="register-user-card">
      <div className="register-user-card__header">
        <h1 className="register-user-card__title">Crear usuario</h1>
        <p className="register-user-card__description">
          Registra un nuevo usuario y completa su información general.
        </p>
      </div>

      <form className="register-user-card__form" onSubmit={onSubmit}>
        <div className="register-user-card__section register-user-card__section--grid">
          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              className="register-user-card__input"
              name="email"
              type="email"
              placeholder="Correo"
              value={values.email}
              onChange={onChange}
              required
            />
          </div>

          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              className="register-user-card__input"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={values.password}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="register-user-card__section register-user-card__section--grid">
          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              className="register-user-card__input"
              name="nombre"
              type="text"
              placeholder="Nombre"
              value={values.nombre}
              onChange={onChange}
            />
          </div>

          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              className="register-user-card__input"
              name="apellido"
              type="text"
              placeholder="Apellido"
              value={values.apellido}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="register-user-card__section register-user-card__section--grid">
          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              className="register-user-card__input"
              name="telefono"
              type="text"
              placeholder="Teléfono"
              value={values.telefono}
              onChange={onChange}
            />
          </div>

          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="fecha_nacimiento">
              Fecha de nacimiento
            </label>
            <input
              id="fecha_nacimiento"
              className="register-user-card__input"
              name="fecha_nacimiento"
              type="date"
              value={values.fecha_nacimiento}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="register-user-card__section">
          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="sobre_mi">
              Sobre mí
            </label>
            <textarea
              id="sobre_mi"
              className="register-user-card__textarea"
              name="sobre_mi"
              placeholder="Sobre mí"
              value={values.sobre_mi}
              onChange={onChange}
            />
          </div>
        </div>

        <div className="register-user-card__section register-user-card__section--grid">
          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="jornada">
              Jornada
            </label>
            <input
              id="jornada"
              className="register-user-card__input"
              name="jornada"
              type="number"
              step="0.01"
              placeholder="Jornada"
              value={values.jornada}
              onChange={onChange}
            />
          </div>

          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="id_zona_horaria">
              Zona horaria
            </label>
            <select
              id="id_zona_horaria"
              className="register-user-card__select"
              name="id_zona_horaria"
              value={values.id_zona_horaria}
              onChange={onChange}
              required
            >
              <option value="">Selecciona zona horaria</option>
              <option value="1">Zona horaria 1</option>
              <option value="2">Zona horaria 2</option>
            </select>
          </div>
        </div>

        <div className="register-user-card__section">
          <div className="register-user-card__field">
            <label className="register-user-card__label" htmlFor="id_rol_global">
              Rol
            </label>
            <select
              id="id_rol_global"
              className="register-user-card__select"
              name="id_rol_global"
              value={values.id_rol_global}
              onChange={onChange}
              required
            >
              <option value="">Selecciona rol</option>
              <option value="1">Administrador</option>
              <option value="2">Usuario</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="register-user-card__feedback register-user-card__feedback--error">
            <p className="register-user-card__feedback-title">No se pudo crear el usuario</p>
            <p className="register-user-card__feedback-description">{error}</p>
          </div>
        )}

        {success && (
          <div className="register-user-card__feedback register-user-card__feedback--success">
            <p className="register-user-card__feedback-title">Usuario creado</p>
            <p className="register-user-card__feedback-description">{success}</p>
          </div>
        )}

        <div className="register-user-card__actions">
          <button
            type="submit"
            className="register-user-card__button"
            disabled={loading}
          >
            {loading && <span className="register-user-card__button-spinner" />}
            <span className="register-user-card__button-text">
              {loading ? 'Creando...' : 'Crear usuario'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}