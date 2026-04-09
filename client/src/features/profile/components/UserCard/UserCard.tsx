import React from 'react';
import styles from './UserCard.module.css';
import { useRandomAvatarSvg } from '../../hooks/useRandomAvatarFromDb';

interface UserCardProps {
  avatarSvg?: string;
  name: string;
  age: number;
  birthDate: string;
  phone: string;
  email: string;
  aboutMe: string;
}

const UserCard: React.FC<UserCardProps> = ({ avatarSvg: avatarSvgProp, name, age, birthDate, phone, email, aboutMe }) => {
  const { avatarSvg: randomSvg } = useRandomAvatarSvg();
  const avatarSvg = avatarSvgProp ?? randomSvg;

  return (
    <div className={styles.profileCard}>
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
        <p className={styles.aboutMeText}>{aboutMe}</p>
      </div>
    </div>
  );
};

export default UserCard;
