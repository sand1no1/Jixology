import React, { useEffect, useState } from 'react';
import { PencilSquareIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import styles from './UserCard.module.css';
import { useUserAvatarSvg } from '../../hooks/useUserAvatarSvg';

interface UserCardProps {
  userId: number;
  avatarSvg?: string;
  name: string;
  age: number;
  birthDate: string;
  phone: string;
  email: string;
  aboutMe: string;
  onSave?: (sobreMi: string) => Promise<void>;
}

const UserCard: React.FC<UserCardProps> = ({
  userId, avatarSvg: avatarSvgProp, name, age, birthDate, phone, email, aboutMe, onSave,
}) => {
  const { avatarSvg: dbSvg } = useUserAvatarSvg(userId);
  const avatarSvg = avatarSvgProp ?? dbSvg;

  const [isEditing, setIsEditing] = useState(false);
  const [draft,     setDraft]     = useState(aboutMe);
  const [saving,    setSaving]    = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Keep draft in sync when the prop changes externally
  useEffect(() => { setDraft(aboutMe); }, [aboutMe]);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(draft);
      setIsEditing(false);
    } catch {
      setSaveError('No se pudo guardar. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(aboutMe);
    setSaveError(null);
    setIsEditing(false);
  };

  return (
    <div className={styles.profileCard}>
      {/* Edit button — top-right corner */}
      {onSave && !isEditing && (
        <button
          className={styles.editCardBtn}
          onClick={() => setIsEditing(true)}
          type="button"
          aria-label="Editar sobre mí"
        >
          <PencilSquareIcon width={16} height={16} />
        </button>
      )}

      <div className={styles.avatarWrapper}>
        <div className={styles.avatarCircle} dangerouslySetInnerHTML={{ __html: avatarSvg }} />
      </div>

      <div className={styles.profileInfo}>
        <div className={styles.infoRow}><span>Nombre: {name}</span></div>
        <div className={styles.infoRow}><span>Edad: {age}</span></div>
        <div className={styles.infoRow}><span>Fecha de Nacimiento: {birthDate}</span></div>
        <div className={styles.infoRow}><span>Telefono: {phone}</span></div>
        <div className={styles.infoRow}><span>Correo: {email}</span></div>
      </div>

      <div className={styles.aboutMeSection}>
        <div className={styles.aboutMeLabel}>Sobre mi</div>

        {isEditing ? (
          <>
            <textarea
              className={styles.aboutMeTextarea}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={4}
              disabled={saving}
              autoFocus
            />
            {saveError && <p className={styles.saveError}>{saveError}</p>}
            <div className={styles.editActions}>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
                type="button"
              >
                <CheckIcon width={14} height={14} />
                {saving ? 'Guardando…' : 'Guardar'}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
                disabled={saving}
                type="button"
              >
                <XMarkIcon width={14} height={14} />
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <p className={styles.aboutMeText}>{aboutMe || '—'}</p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
