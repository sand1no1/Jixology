import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
//import {
//  CalendarDaysIcon
//} from '@heroicons/react/24/solid';

import userImg from '@/assets/images/ProfileDefualt.jpg';
import styles from './ProjectTasks.module.css';

// =====================
// TYPES (simulan backend)
// =====================
export interface Task {
  id: string;
  title: string;
  date?: string;
  user?: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface IProjectTasksProps {
  children?: ReactNode;
}

// =====================
// MOCK BACKEND
// =====================
const fetchMockData = async (): Promise<Column[]> => {
  // Simula delay de API
  await new Promise(res => setTimeout(res, 300));

  return [
    {
      id: 'pending',
      title: 'Tareas Pendientes',
      tasks: [
        { id: '1', title: 'Terminar Frontend', date: '11/25', user: 'Pedrito' },
        { id: '2', title: 'Decorar UI', date: '12/25', user: 'Pablito' }
      ]
    },
    {
      id: 'progress',
      title: 'Tareas En Proceso',
      tasks: [
        { id: '3', title: 'Jugar Slay the Spire 2', date: '12/25', user: 'Pepito' },
        { id: '4', title: 'Endpoints Avatar', date: '12/25', user: 'Juanito' }
      ]
    },
    {
      id: 'done',
      title: 'Tareas Terminadas',
      tasks: [
        { id: '5', title: 'Jugar Slay the Spire 2', date: '12/25', user: 'Pepito' },
        { id: '6', title: 'Endpoints Avatar', date: '12/25', user: 'Juanito' }
      ]
    }
  ];
};

// =====================
// COMPONENTES
// =====================

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className={styles.TaskCard} draggable>
      <label>{task.title}</label>

      {task.date && (
        <div className={styles.TaskData}>
          
          <label>{task.date}</label>
          <div>
            <label>{task.user}</label>
            <img src={userImg} className={styles.pfp} />
          </div>
        </div>
      )}
    </div>
  );
};

const TaskColumn: React.FC<{ column: Column }> = ({ column }) => {
  return (
    <div className={styles.ProjectList}>
      <div className={styles.UpperTitle}>
        <label className={styles.SectionTitle}>{column.title}</label>
        <label>Hola</label>
      </div>

      {column.tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

// =====================
// MAIN COMPONENT
// =====================

const ProjectTasks: React.FC<IProjectTasksProps> = ({ children }) => {
  const [columns, setColumns] = useState<Column[]>([]);

  // Simula fetch backend
  useEffect(() => {
    fetchMockData().then(data => setColumns(data));
  }, []);

  // TU DRAG ACTUAL (sin tocar mucho)
  useEffect(() => {
    const draggables = document.querySelectorAll<HTMLElement>('[draggable="true"]');
    const sections = document.querySelectorAll<HTMLElement>(`.${styles.ProjectList}`);

    draggables.forEach(draggable => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add(styles.dragging);
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove(styles.dragging);
      });
    });

    sections.forEach(section => {
      section.addEventListener("dragover", e => {
        e.preventDefault();

        const belowElement = positionCheck(section, e.clientY);
        const draggable = document.querySelector(`.${styles.dragging}`) as HTMLElement | null;

        if (!draggable) return;

        if (belowElement == null) {
          section.appendChild(draggable);
        } else {
          section.insertBefore(draggable, belowElement);
        }
      });
    });

    function positionCheck(section: HTMLElement, Y: number) {
      const list = [...section.querySelectorAll<HTMLElement>(`[draggable="true"]:not(.${styles.dragging})`)];

      return list.reduce<{ offset: number; element: HTMLElement | null }>(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = Y - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return { offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY, element: null }
      ).element;
    }

  }, [columns]); // importante: cuando cargan datos

  return (
    <div className={styles.container}>
      <div className={styles.mainLists}>
        {columns.map(col => (
          <TaskColumn key={col.id} column={col} />
        ))}
      </div>

      {children}
    </div>
  );
};

export default ProjectTasks;