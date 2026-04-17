import React, { useMemo, useState } from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import styles from './ProjectsPage.module.css';
import { useUser } from '@/core/auth/userContext';  


// --- Interfaces ---
import type { Project } from '@/features/projects/types/Project';

// --- Hooks ---
import { useProjectCards} from '../../hooks/useProjects';
import { useRecentProjects } from '../../hooks/useRecentProjects';

// --- Componentes ---
import ProjectCard from '@/features/projects/components/ProjectCard';
import StatusLabel from '@/shared/components/StatusLabel';
import SearchBarComponent from '@/shared/components/SearchBarComponent';
import EmptyState from '@/shared/components/EmptyState';
import SkeletonCard from '@/shared/components/SkeletonCard';
import CreateProject from '@/features/projects/components/CreateProject';
import ProjectCreationToast from '@/features/projects/components/ProjectCreationToast';

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

const ProjectsPage: React.FC = () => {
  const { user, loading: userLoading } = useUser(); 
  const { projects, loading: projectsLoading, error } = useProjectCards(user?.idRolGlobal , user?.id, userLoading);
  const loading = userLoading || projectsLoading;
  const [search, setSearch]         = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('TodosLosProyectos');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [creationSuccessMessage, setCreationSuccessMessage] = useState<string | null>(null);
  const { recentIds, trackVisit } = useRecentProjects(user?.id); 

  const renderCard = (project: Project) => (
  <ProjectCard
    key={project.id}
    projectId={project.id}
    projectName={project.nombre}
    projectStatus={project.id_estatus}
    projectStack={project.stack_tecnologico ?? []}
    completition={project.completion_percentage ?? 0}
    projectDescription={project.descripcion}
    projectDueDate={project.fecha_final}
    projectFTE={project.fte}
    statusLabel={<StatusLabel statusId={project.id_estatus} />}
    onClick={() => trackVisit(project.id)}
  />
);

  const filteredProjects = useMemo(() => {
    const statusId = FILTER_TO_STATUS_ID[activeFilter];

    return projects
      .filter((project) => statusId === undefined || project.id_estatus === statusId)
      .filter((project) =>
        project.nombre.toLowerCase().includes(search.toLowerCase()),
      );
  }, [projects, search, activeFilter]);

  const recentProjects = useMemo( () => {
    return recentIds.map( (id) => projects.find((p) => p.id === id))
             .filter((p): p is Project => p !== undefined);

  }, [projects, recentIds]);

  const isSearching = search.trim().length > 0;
  const isFiltering = activeFilter !== 'TodosLosProyectos';

  if (error) {
    console.log(error);
    return (
      <EmptyState
        title="Error obteniendo los proyectos"
        subtitle="Verifica tu conexión e intenta de nuevo."
      />
    );
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.searchWrapper}>
            <SearchBarComponent infoText="Buscar proyectos" onChange={setSearch} />
          </div>
          <button className={`${styles.createProject} ${styles.createProjectWrapper}`} onClick={() => setIsCreateProjectOpen(true)}>
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
          <div className={styles.grid}>
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title="No hay proyectos disponibles"
            subtitle="No tienes proyectos asignados o aún no se han creado."
          />
        ) : isSearching || isFiltering ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Resultados</h2>
            <div className={styles.grid}>{filteredProjects.map(renderCard)}</div>
          </section>
        ) : (
          <>
            {recentProjects.length !== 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Proyectos recientes</h2>
                <div className={styles.grid}>
                  {recentProjects.map(p => (
                    <ProjectCard
                      key={p.id}
                      projectId={p.id}
                      projectName={p.nombre}
                      projectStatus={p.id_estatus}
                      projectStack={p.stack_tecnologico ?? []}
                      completition={p.completion_percentage ?? 0}
                      projectDescription={p.descripcion}
                      projectDueDate={p.fecha_final}
                      projectFTE={p.fte}
                      statusLabel={<StatusLabel statusId={p.id_estatus} />}
                      forceExpanded
                      onClick={() => trackVisit(p.id)}
                    />
                  ))}
                </div>
            </section>
        )}
            <div className={styles.divider} />

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Todos los proyectos</h2>
              <div className={styles.grid}>{projects.map(renderCard)}</div>
            </section>
          </>
        )}
      </div>

      <CreateProject
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreated={(message) => {
          setCreationSuccessMessage(message);
          setIsCreateProjectOpen(false);
        }}
      />
      {creationSuccessMessage ? (
        <ProjectCreationToast
          message={creationSuccessMessage}
          onClose={() => setCreationSuccessMessage(null)}
          autoCloseMs={3500}
        />
      ) : null}
    </>
  );
};

export default ProjectsPage;