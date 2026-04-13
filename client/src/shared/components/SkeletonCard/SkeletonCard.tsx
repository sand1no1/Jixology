import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard: React.FC = () => {
  return (
    <div className={styles.card}>
      <div className={styles.band} />
      <div className={styles.body}>
        <div className={`${styles.line} ${styles.lineLong}`} />
        <div className={`${styles.line} ${styles.lineShort}`} />
      </div>
      <div className={styles.footer}>
        <div className={`${styles.pill}`} />
        <div className={`${styles.pill}`} />
      </div>
    </div>
  );
};

export default SkeletonCard;
