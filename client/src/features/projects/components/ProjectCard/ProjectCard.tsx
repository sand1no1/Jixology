import React, { useState } from 'react';
import type { ReactNode } from 'react';
import styles from './ProjectCard.module.css';

import { statusClassMap } from '@/shared/utils/statusClassMap';
import PercentageBar from '@/shared/components/PercentageBar';

export interface IProjectCardProps {
  projectId: number;
  projectName: string;
  projectStatus: number;
  projectStack: string[];
  completition: number;
  statusLabel: ReactNode;
  projectDueDate: string;      // ISO formato de supabase: "2026-06-15"
  projectDescription: string;
  projectFTE: number;
}

const ProjectCard: React.FC<IProjectCardProps> = ({
  projectName,
  projectStatus,
  projectStack,
  completition,
  statusLabel,
  projectDueDate,
  projectDescription,
  projectFTE,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const containerColor = statusClassMap[projectStatus]?.cssClass ?? 'status-unassigned';
  const formattedDate = new Date(projectDueDate).toLocaleDateString();

  return (
    <div
      className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`${styles.statusBand} ${containerColor}`} />

      {/* Elementos base del projecto simepre visbiles*/}
      <div className={styles.cardElements}>
        <p className={styles.projectName}>{projectName}</p>
        {statusLabel}
      </div>

      {/* Solo visible cuando está expanded */}
      {isExpanded && (
        <>
          <p className={styles.description}>{projectDescription}</p>
          <div className={styles.progressWrapper}>
            <div className={styles.progressInformation}>
            <p className={styles.progreso}>Progreso:</p>
            <p className={styles.progreso} >{completition}%</p>
            </div>
            <PercentageBar percentage={completition} barColor={containerColor} />
          </div>
        </>
      )}

      <hr className={styles.divider} />

      {/* Footer: stack siempre visible, fecha y FTE solo en expanded */}
      <div className={styles.footer}>
        <div className={styles.stack}>
          {isExpanded ? (
            projectStack.map((element) => (
              <span key={element} className={styles.stackPill}>{element}</span>
            ))
          ) : (
            <>
              {projectStack[0] && (
                <span className={styles.stackPill}>{projectStack[0]}</span>
              )}
              {projectStack.length > 1 && (
                <span className={styles.stackPill}>+{projectStack.length - 1} más</span>
              )}
            </>
          )}
        </div>
        {isExpanded && (
          <div className={styles.meta}>
            <span>FTE: {projectFTE}</span>
            <span>Vence {formattedDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
