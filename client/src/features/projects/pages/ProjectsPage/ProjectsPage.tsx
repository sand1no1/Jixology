import React, { useEffect, useMemo, useState } from 'react';
import styles from './ProjectsPage.module.css';

// --- Interfaces ---
import type { Project } from '@/features/projects/types/Project';

// --- Servicios ---
import { fetchProjects } from '../../services/projectsMock';

import { statusClassMap } from '@/shared/utils/statusClassMap';

// --- Componentes ---
import ProjectCard from '@/features/projects/components/ProjectCard';
import StatusLabel from '@/shared/components/StatusLabel';
import SearchBarComponent from '@/shared/components/SearchBarComponent';

type FilterKey = 'TodosLosProyectos' | 'Completados' | 'EnProgreso' | 'Retrasado' | 'SinAsignar';

const FILTER_TO_STATUS_ID: Partial<Record<FilterKey, number>> = {
  Completados: 1,
  EnProgreso:  2,
  Retrasado:   3,
  SinAsignar:  4,
};

const FILTER_LABELS: Record<FilterKey, string> = {
  TodosLosProyectos: 'Todos',
  Completados:       'Completado',
  EnProgreso:        'En Progreso',
  Retrasado:         'Retrasado',
  SinAsignar:        'Sin Asignar',
};

const renderCard = (project: Project) => (
  <ProjectCard
    key={project.id}
    projectId={project.id}
    projectName={project.nombre}
    projectStatus={project.id_estatus}
    projectStack={[]}
    completition={0}
    projectDescription={project.descripcion}
    projectDueDate={project.fecha_final}
    projectFTE={project.fte}
    statusLabel={<StatusLabel statusId={project.id_estatus} />}
  />
);

const ProjectsPage: React.FC = () => {
  const [projects, setProjects]     = useState<Project[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('TodosLosProyectos');

  useEffect(() => {
    fetchProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const recentProjects = projects.slice(-4).reverse();

  const filteredProjects = useMemo(() => {
    const statusId = FILTER_TO_STATUS_ID[activeFilter];
    return projects
      .filter((p) => statusId === undefined || p.id_estatus === statusId)
      .filter((p) => p.nombre.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search, activeFilter]);

  const isSearching = search.trim().length > 0;
  const isFiltering = activeFilter !== 'TodosLosProyectos';

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ flex: 9 }}>
          <SearchBarComponent infoText="Buscar proyectos" onChange={setSearch} />
        </div>
        <button id={styles.createProject} style={{ flex: 1 }}>
          Crear proyecto
        </button>
      </div>
      <div className={styles.filterPills}>
        {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveFilter(key)}
            className={`${styles.pill} ${activeFilter === key ? styles.pillActive : ''}`}
          >
            {FILTER_LABELS[key]}
          </button>
        ))}
      </div>
      {loading ? (
        <p>Cargando proyectos...</p>
      ) : isSearching || isFiltering ? (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Resultados</h2>
          <div className={styles.grid}>
            {filteredProjects.map(renderCard)}
          </div>
        </section>
      ) : (
        <>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Proyectos recientes</h2>
            <div className={styles.grid}>
              {recentProjects.map(renderCard)}
            </div>
          </section>

          <div className={styles.divider} />

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Todos los proyectos</h2>
            <div className={styles.grid}>
              {projects.map(renderCard)}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProjectsPage;
