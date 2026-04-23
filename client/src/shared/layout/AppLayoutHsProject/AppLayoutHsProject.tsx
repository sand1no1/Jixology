import React from 'react';
import type { ReactNode } from 'react';
import styles from './AppLayoutHsProject.module.css';
import {Outlet} from "react-router-dom"
import Header from '@/shared/layout/Header';
import Sidebar from '@/shared/layout/Sidebar';
import ProjectHeader from '@/shared/layout/HeaderProject';

export interface IAppLayoutHsProps {
  children?: ReactNode;
}

const AppLayoutHs: React.FC<IAppLayoutHsProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.belowHeadbar}>
        <Sidebar />
        <div className={styles.innerProject}>
          <ProjectHeader />
          <Outlet />
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayoutHs;