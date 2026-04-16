import React from 'react';
 import type { ReactNode } from 'react';
 import { useEffect } from 'react'; //Investigar bien que hace

import user from '@/assets/images/ProfileDefualt.jpg';

// --- Estilos ---
import styles from './ProjectTasks.module.css';

// --- Interfaces ---
export interface IProjectTasksProps {
  children?: ReactNode;
}


const ProjectTasks: React.FC<IProjectTasksProps> = ({ children }) => { //Codigo va dentro de aqui, antes del main

  useEffect(() => {
    const draggables = document.querySelectorAll<HTMLElement>('[draggable="true"]');
    const sections = document.querySelectorAll<HTMLElement>(`.${styles.ProjectList}`);

    draggables.forEach(draggable => {
      draggable.addEventListener("dragstart", () => {
        draggable.classList.add(styles.dragging)
      });

      draggable.addEventListener("dragend", () => {
        draggable.classList.remove(styles.dragging)
      });
    });

    sections.forEach(section =>{
      section.addEventListener("dragover", d => {
        d.preventDefault();
        const belowElement = positionCheck(section, d.clientY)
        const draggable = document.querySelector(`.${styles.dragging}`)
        if (!draggable) return;
        if (belowElement == null) {
          section.appendChild(draggable)
        } else {
          section.insertBefore(draggable, belowElement)
        }
      })
    })

    function positionCheck(Section: HTMLElement, Y: number) {
      const list = [...Section.querySelectorAll<HTMLElement>(`[draggable="true"]:not(.${styles.dragging})`)]
      
      return list.reduce<{ offset: number; element: HTMLElement | null }>((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = Y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
          return {offset: offset, element: child}
        } else {
          return closest
        }
        
      }, {offset: Number.NEGATIVE_INFINITY, element: null}
    ).element
    }

  }, []);

  return (<>
    <div className={styles.container}>
      <div className={styles.mainLists}>
        <div className={styles.ProjectList}>
          <label className={styles.SectionTitle}>Tareas Pendientes</label>
          <div className={styles.TaskCard} draggable={true}>
              <label>Terminar el Desarrollo del Frontend y sus principals cualidades</label>
              <div className={styles.TaskData}>
                <label>11/25</label>
                <div><label>Pedrito</label><img src={user} className={styles.pfp} /></div>
              </div>
          </div>
          <div className={styles.TaskCard} draggable={true}>
              <label>Decorar la interfaz de usuario</label>
              <div className={styles.TaskData}>
                <label>12/25</label>
                <div><label>Pablito</label><img src={user} className={styles.pfp} /></div>
              </div>
          </div>
        </div>

        <div className={styles.ProjectList}>
          <label className={styles.SectionTitle}>Tareas En Proceso</label>
          <div className={styles.TaskCard} draggable={true}>
              <label>Jugar Slay the Spire 2</label>
              <div className={styles.TaskData}>
                <label>12/25</label>
                <div><label>Pepito</label><img src={user} className={styles.pfp} /></div>
              </div>
          </div>
          <div className={styles.TaskCard} draggable={true}>
              <label>Programar Endpoints de Avatar</label>
              <div className={styles.TaskData}>
                <label>12/25</label>
                <div><label>Juanito</label><img src={user} className={styles.pfp} /></div>
              </div>
          </div>
        </div>

        <div className={styles.ProjectList}>
          <label className={styles.SectionTitle}>Tareas Terminadas</label>
          <div className={styles.TaskCard} draggable={true}>
            <label>Tarea 7</label>
          </div>
          <div className={styles.TaskCard} draggable={true}>
            <label>Tarea 8</label>
          </div>
          <div className={styles.TaskCard} draggable={true}>
            <label>Tarea 9</label>
          </div>
          <div className={styles.TaskCard} draggable={true}>
            <label>Tarea 10</label>
          </div>
          <div className={styles.TaskCard} draggable={true}>
            <label>Tarea 11</label>
          </div>
        </div>
      </div>
      {children}
    </div>
  </>);
};

export default ProjectTasks;
