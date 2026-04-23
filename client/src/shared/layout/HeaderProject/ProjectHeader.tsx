import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './ProjectHeader.module.css';

const NAV_ITEMS = [
  { label: 'Tareas',   to: '/proyectos/dummy/tasks'   },
  { label: 'Backlog',  to: '/proyectos/dummy/backlog'  },
];

const Header: React.FC = () => {
  return (
    <div className={styles.headerP}>
      {NAV_ITEMS.map(({ label, to }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.element}${isActive ? ` ${styles.elementActive}` : ''}`
          }
        >
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Header;
