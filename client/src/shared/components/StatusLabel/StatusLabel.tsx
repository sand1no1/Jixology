import React from 'react';
import { statusClassMap } from '@/shared/utils/statusClassMap';
import styles from './StatusLabel.module.css';

// un pill banner que muestra el status
export interface IStatusLabelProps {
  statusId: number;
  statusName: string;
  statusOrder: number;
  isTerminal?: boolean;
}


const StatusLabel: React.FC<IStatusLabelProps> = ({ statusId, statusName, /*isTerminal = false*/ }) => {
  const statusClass = statusClassMap[statusId] ?? 'status-unassigned';

  return (
    <div className={`${styles.pill} ${statusClass}`}>
      {statusName}
    </div>
  );
};

export default StatusLabel;