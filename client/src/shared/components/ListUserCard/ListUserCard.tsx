import React from 'react';
import { UserIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import styles from './ListUserCard.module.css';
import { useUserAvatarSvg } from '@/features/profile/hooks/useUserAvatarSvg';

export interface Role {
  label: string;
  color: string;
  textColor: string;
}

interface ListUserCardProps {
  userId: number;
  fullName: string;
  roles: Role[];
  email: string;
  avatarSvg?: string;
  onEdit?: (position: { x: number; y: number }) => void;
  onAvatarEnter?: (rect: DOMRect) => void;
  onAvatarLeave?: () => void;
}

const ListUserCard: React.FC<ListUserCardProps> = ({
  userId,
  fullName,
  roles,
  email,
  avatarSvg: avatarSvgProp,
  onEdit,
  onAvatarEnter,
  onAvatarLeave,
}) => {
  const { avatarSvg: dbSvg } = useUserAvatarSvg(userId);
  const avatarSvg = avatarSvgProp ?? dbSvg;

  return (
    <div className={styles.row}>
      <div
        className={`${styles.avatar}${onAvatarEnter ? ` ${styles.avatarClickable}` : ''}`}
        onMouseEnter={
          onAvatarEnter
            ? (e) => onAvatarEnter((e.currentTarget as HTMLElement).getBoundingClientRect())
            : undefined
        }
        onMouseLeave={onAvatarLeave}
        aria-label={onAvatarEnter ? `Ver perfil de ${fullName}` : undefined}
      >
        {avatarSvg ? (
          <div
            className={styles.avatarSvg}
            dangerouslySetInnerHTML={{ __html: avatarSvg }}
          />
        ) : (
          <UserIcon width={18} height={18} />
        )}
      </div>

      <span className={styles.name}>
        <span className={styles.nameLabel}>nombre completo: </span>
        {fullName}
      </span>

      <div className={styles.spacer} />

      <div className={styles.roles}>
        <span className={styles.rolesLabel}>Roles:</span>
        {roles.map((role) => (
          <span
            key={role.label}
            className={styles.badge}
            style={{ backgroundColor: role.color, color: role.textColor }}
          >
            {role.label}
          </span>
        ))}
      </div>

      <span className={styles.email}>
        <span className={styles.emailLabel}>Correo: </span>
        <span className={styles.emailValue}>{email}</span>
      </span>

      <button
        type="button"
        className={styles.optionsButton}
        aria-label="Más opciones"
        title="Más opciones"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.({
            x: e.clientX,
            y: e.clientY,
          });
        }}
      >
        <EllipsisVerticalIcon className={styles.optionsButtonIcon} />
      </button>
    </div>
  );
};

export default ListUserCard;