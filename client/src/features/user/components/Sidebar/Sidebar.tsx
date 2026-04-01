import React from 'react';
 import type { ReactNode } from 'react';
import styles from './Sidebar.module.css';

export interface ISidebarProps {
  children?: ReactNode;
}

const Sidebar: React.FC<ISidebarProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default Sidebar;