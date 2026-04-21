import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import styles from './UserCard.module.css';
import { useUserAvatarSvg } from '../../hooks/useUserAvatarSvg';

export interface UserCardEditValues {
  nombre: string;
  apellido: string;
  birthDate: string;
  phone: string;
  email: string;
  aboutMe: string;
  password?: string;
  idRolGlobal?: string;
  idZonaHoraria?: string;
  jornada?: string;
}

interface UserCardProps {
  userId: number;
  avatarSvg?: string;
  name: string;
  age: number;
  birthDate: string;
  phone: string;
  email: string;
  aboutMe: string;
  editable?: boolean;
  canEdit?: boolean;
  formValues?: UserCardEditValues;
  onFieldChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  saving?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  userId,
  avatarSvg: avatarSvgProp,
  name,
  age,
  birthDate,
  phone,
  email,
  aboutMe,
  editable = false,
  canEdit = false,
  formValues,
  onFieldChange,
  onSubmit,
  onCancel,
  saving = false,
}) => {
  const { avatarSvg: dbSvg } = useUserAvatarSvg(userId);
  const avatarSvg = avatarSvgProp ?? dbSvg;

  const showEditMode = editable && canEdit && formValues && onFieldChange && onSubmit;

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatarWrapper}>
        <div
          className={styles.avatarCircle}
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />
      </div>

      {showEditMode ? (
        <form onSubmit={onSubmit} className={styles.editForm}>
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Nombre</span>
                <input
                  className={styles.inputField}
                  name="nombre"
                  value={formValues.nombre}
                  onChange={onFieldChange}
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Apellido</span>
                <input
                  className={styles.inputField}
                  name="apellido"
                  value={formValues.apellido}
                  onChange={onFieldChange}
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Fecha de nacimiento</span>
                <input
                  className={styles.inputField}
                  name="fecha_nacimiento"
                  type="date"
                  value={formValues.birthDate}
                  onChange={onFieldChange}
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Teléfono</span>
                <input
                  className={styles.inputField}
                  name="telefono"
                  value={formValues.phone}
                  onChange={onFieldChange}
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Correo</span>
                <input
                  className={styles.inputField}
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={onFieldChange}
                  required
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Nueva contraseña</span>
                <input
                  className={styles.inputField}
                  name="password"
                  type="password"
                  value={formValues.password ?? ''}
                  onChange={onFieldChange}
                  placeholder="Déjala vacía para no cambiarla"
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>ID rol global</span>
                <input
                  className={styles.inputField}
                  name="id_rol_global"
                  type="number"
                  value={formValues.idRolGlobal ?? ''}
                  onChange={onFieldChange}
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>ID zona horaria</span>
                <input
                  className={styles.inputField}
                  name="id_zona_horaria"
                  type="number"
                  value={formValues.idZonaHoraria ?? ''}
                  onChange={onFieldChange}
                />
              </label>
            </div>

            <div className={styles.infoRow}>
              <label className={styles.fieldLabel}>
                <span>Jornada</span>
                <input
                  className={styles.inputField}
                  name="jornada"
                  value={formValues.jornada ?? ''}
                  onChange={onFieldChange}
                />
              </label>
            </div>
          </div>

          <div className={styles.aboutMeSection}>
            <div className={styles.aboutMeLabel}>Sobre mí</div>
            <textarea
              className={styles.aboutMeTextarea}
              name="sobre_mi"
              value={formValues.aboutMe}
              onChange={onFieldChange}
            />
          </div>

          <div className={styles.editActions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {onCancel && (
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onCancel}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <>
          <div className={styles.profileInfo}>
            <div className={styles.infoRow}>
              <span>Nombre: {name}</span>
            </div>
            <div className={styles.infoRow}>
              <span>Edad: {age}</span>
            </div>
            <div className={styles.infoRow}>
              <span>Fecha de Nacimiento: {birthDate}</span>
            </div>
            <div className={styles.infoRow}>
              <span>Telefono: {phone}</span>
            </div>
            <div className={styles.infoRow}>
              <span>Correo: {email}</span>
            </div>
          </div>

          <div className={styles.aboutMeSection}>
            <div className={styles.aboutMeLabel}>Sobre mi</div>
            <p className={styles.aboutMeText}>{aboutMe}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserCard;