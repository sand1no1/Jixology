import React from 'react';
import type { ReactNode } from 'react';
import './StatusLabel.css';

export interface IStatusLabelProps {
  children?: ReactNode;
  statusId: number;
  statusOrder: number;
  isTerminal: boolean; 
}

const StatusLabel: React.FC<IStatusLabelProps> = ({ statusId, statusOrder, isTerminal, children }) => {
  return (
    <div className="status-label">
      {children}
    </div>
  );
};

export default StatusLabel;