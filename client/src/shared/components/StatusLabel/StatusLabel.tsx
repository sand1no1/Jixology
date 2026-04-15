import React from 'react';
import { statusClassMap } from '@/shared/utils/statusClassMap';
import styles from './StatusLabel.module.css';

// un pill banner que muestra el status
export interface IStatusLabelProps {
  statusId: number;
  statusName?: string;
  statusOrder?: number;
  isTerminal?: boolean;
}

const StatusLabel: React.FC<IStatusLabelProps> = ({ statusId, statusName }) => {
  const status = statusClassMap[statusId];
  const statusClass = status?.cssClass ?? 'status-unassigned';
  const displayName = statusName ?? status?.nombre ?? '';

  return (
    <div className={`${styles.pill} ${statusClass}`}>
      {displayName}
    </div>
  );
};

export default StatusLabel;