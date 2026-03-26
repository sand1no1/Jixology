import React, { useState, useEffect } from 'react';
import styles from './PercentageBar.module.css';

export interface IPercentageBarProps {
  percentage: number; // 0-100
  barColor: string;
}

const PercentageBar: React.FC<IPercentageBarProps> = ({ percentage, barColor }) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayWidth(clamped), 50);
    return () => clearTimeout(timer);
  }, [clamped]);

  return (
    <div className={styles.track}>
      <div className={`${styles.fill} ${barColor}`} style={{ width: `${displayWidth}%` }} />
    </div>
  );
};

export default PercentageBar;