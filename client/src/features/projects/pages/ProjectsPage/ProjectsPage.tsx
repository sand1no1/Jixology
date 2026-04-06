import React from 'react';
 import type { ReactNode } from 'react';
import styles from './ProjectsPage.module.css';

export interface IProjectsPageProps {
  children?: ReactNode;
}

const ProjectsPage: React.FC<IProjectsPageProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};

export default ProjectsPage;