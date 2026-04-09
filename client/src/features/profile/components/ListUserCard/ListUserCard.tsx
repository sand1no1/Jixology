import React from 'react';
import { UserIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import styles from './ListUserCard.module.css';

export interface Role {
  label: string;
  color: string;      // background colour
  textColor: string;  // text colour
}

interface ListUserCardProps {
  fullName: string;
  roles: Role[];
  email: string;
  onEdit?: () => void;
}

const ListUserCard: React.FC<ListUserCardProps> = ({ fullName, roles, email, onEdit }) => (
  <div className={styles.row}>
    {/* Avatar icon */}
    <div className={styles.avatar}>
      <UserIcon width={18} height={18} />
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

export default ListUserCard;
