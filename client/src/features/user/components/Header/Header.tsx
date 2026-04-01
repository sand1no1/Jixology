import React from 'react';
 import type { ReactNode } from 'react';
import styles from './Header.module.css';

export interface IHeaderProps {
  children?: ReactNode;
}

const Header: React.FC<IHeaderProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default Header;