import React from 'react';
import styles from './EmptyState.module.css';

export interface IEmptyStateProps {
  title?: string;
  subtitle?: string;
}

const EmptyState: React.FC<IEmptyStateProps> = ({
  title    = 'No hay elementos disponibles',
  subtitle = 'No se encontraron registros para mostrar.',
}) => {
  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.icon}
      >
        <path d="M3 7h18M3 12h18M3 17h18" />
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <p className={styles.title}>{title}</p>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
};

export default EmptyState;
