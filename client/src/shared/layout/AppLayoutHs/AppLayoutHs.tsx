import React from 'react';
import type { ReactNode } from 'react';
import styles from './AppLayoutHs';
import {Outlet} from "react-router-dom"
import Header from '@/shared/layout/Header';
import Sidebar from '@/shared/layout/Sidebar';

export interface IAppLayoutHsProps {
  children?: ReactNode;
}

const AppLayoutHs: React.FC<IAppLayoutHsProps> = ({ children }) => {
  return (
    <div>
      <Header />
      <div className={styles.belowHeadbar}>
        <Sidebar />
        <Outlet />
        {children}
      </div>
    </div>
  );
};

export default AppLayoutHs;