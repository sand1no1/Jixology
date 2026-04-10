import React from 'react';
import { UserIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import styles from './ListUserCard.module.css';
import { useRandomAvatarSvg } from '../../hooks/useRandomAvatarFromDb';

export interface Role {
  label: string;
  color: string;
  textColor: string;
}

interface ListUserCardProps {
  fullName: string;
  roles: Role[];
  email: string;
  avatarSvg?: string;
  onEdit?: () => void;
}

const ListUserCard: React.FC<ListUserCardProps> = ({ fullName, roles, email, avatarSvg: avatarSvgProp, onEdit }) => {
  const { avatarSvg: randomSvg } = useRandomAvatarSvg();
  const avatarSvg = avatarSvgProp ?? randomSvg;

  return (
    <div className={styles.row}>
      {/* Avatar */}
      <div className={styles.avatar}>
        {avatarSvg
          ? <div className={styles.avatarSvg} dangerouslySetInnerHTML={{ __html: avatarSvg }} />
          : <UserIcon width={18} height={18} />
        }
      </div>

      {/* Name */}
      <span className={styles.name}>
        <span className={styles.nameLabel}>nombre completo: </span>
        {fullName}
      </span>

      <div className={styles.spacer} />

      {/* Roles */}
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

      {/* Email */}
      <span className={styles.email}>
        <span className={styles.emailLabel}>Correo: </span>
        <span className={styles.emailValue}>{email}</span>
      </span>

      {/* Edit button */}
      <button className={styles.editBtn} onClick={onEdit} type="button" aria-label="Editar usuario">
        <PencilSquareIcon width={15} height={15} />
      </button>
    </div>
  );
};

export default ListUserCard;
