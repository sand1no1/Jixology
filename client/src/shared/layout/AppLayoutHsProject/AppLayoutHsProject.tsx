import React from 'react';
import type { ReactNode } from 'react';
import styles from './AppLayoutHsProject.module.css';
// Imports de React Dom
import {Outlet} from "react-router-dom"
//import { useNavigate, useParams, Navigate } from 'react-router-dom';
//import { useUser } from '@/core/auth/userContext';
//Referencias
import Header from '@/shared/layout/Header';
import Sidebar from '@/shared/layout/Sidebar';
import ProjectHeader from '@/shared/layout/HeaderProject';

export interface IAppLayoutHsProps {
  children?: ReactNode;
}

interface HeaderProps {
  title: string;
}


const AppLayoutHs: React.FC<IAppLayoutHsProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      <Header title="Proyecto 1"/>
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