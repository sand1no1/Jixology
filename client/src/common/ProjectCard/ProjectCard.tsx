import React from 'react';
import type { ReactNode } from 'react';
import './ProjectCard.css';

export interface IProjectCardProps {
  children?: ReactNode;
  projectId: number;
  projectName: string;
  projectStatus: number;
}

const ProjectCard: React.FC<IProjectCardProps> = ({ children }) => {
  return (
    <div className="project-card">
      {children}
    </div>
  );
};

export default ProjectCard;