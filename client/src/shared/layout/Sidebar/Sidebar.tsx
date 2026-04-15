import React from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
  UserCircleIcon,
  BeakerIcon,
  LockClosedIcon,
  BookOpenIcon,
  BookmarkIcon,
  UserPlusIcon,
  MinusCircleIcon,
} from '@heroicons/react/24/solid';
import { signOutService } from '@/features/auth/services/auth.service';

export interface ISidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutService();
      navigate('/inicio-sesion', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>
            <a href="/dashboard-usuario">
              <BeakerIcon className={styles.icon} />
              <span><b>Dashboard</b></span>
            </a>
          </li>
          <li className={styles.menuItem}>
            <a href="/proyectos">
              <BookOpenIcon className={styles.icon} />
              <span><b>Proyectos</b></span>
            </a>
          </li>
          <li className={styles.menuItem}>
            <a href="/proyectos/dummy">
              <BookmarkIcon className={styles.icon} />
              <span><b>Dummy</b></span>
            </a>
          </li>
          <li className={styles.menuItem}>
            <a href="/perfil">
              <UserCircleIcon className={styles.icon} />
              <span><b>Perfil</b></span>
            </a>
          </li>

          <li className={styles.menuItem}>
            <a href="/inicio-sesion">
              <LockClosedIcon className={styles.icon} />
              <span><b>Verificación</b></span>
            </a>
          </li>
          <li className={styles.menuItem}>
            <a href="/usuarios">
              <UserPlusIcon className={styles.icon} />
              <span><b>Crear Usuario</b></span>
            </a>
          </li>
          <li className={styles.menuItem}>
            <button
              type="button"
              onClick={handleLogout}
              className={styles.logOut}
            >
              <MinusCircleIcon className={styles.icon} />
              <span><b>Cerrar Sesión</b></span>
            </button>
          </li>
        </ul>
      </aside>

      <div className={styles.overlay}></div>
    </>
  );
};

export default Sidebar;