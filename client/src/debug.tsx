import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ProjectCard from '@/features/projects/ProjectCard';
import StatusLabel from '@/common/ui/StatusLabel';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: 'monospace' }}>Debug Playground</h2>

      <ProjectCard
        projectId={1}
        projectName="Proyecto Alpha"
        projectStatus={1}
        projectStack={['React', 'TypeScript', 'Supabase']}
        completition={100}
        projectDescription="Migración completa del sistema legacy a arquitectura moderna con React y Supabase."
        projectDueDate="2026-03-01"
        projectFTE={3}
        statusLabel={<StatusLabel statusId={1} statusOrder={1} isTerminal={true} statusName="Completado" />}
      />

      <ProjectCard
        projectId={2}
        projectName="Proyecto Beta"
        projectStatus={2}
        projectStack={['Vue', 'Node.js', 'PostgreSQL']}
        completition={60}
        projectDescription="Desarrollo del módulo de reportes financieros con exportación a PDF y Excel."
        projectDueDate="2026-05-15"
        projectFTE={5}
        statusLabel={<StatusLabel statusId={2} statusOrder={2} isTerminal={false} statusName="En Progreso" />}
      />

      <ProjectCard
        projectId={3}
        projectName="Proyecto Gamma"
        projectStatus={3}
        projectStack={['Angular', 'Express', 'MongoDB']}
        completition={30}
        projectDescription="Integración con API de pagos externos. Bloqueado por dependencia de proveedor."
        projectDueDate="2026-04-10"
        projectFTE={2}
        statusLabel={<StatusLabel statusId={3} statusOrder={3} isTerminal={false} statusName="Retrasado" />}
      />

      <ProjectCard
        projectId={4}
        projectName="Proyecto Delta"
        projectStatus={4}
        projectStack={['React Native', 'Firebase']}
        completition={0}
        projectDescription="App móvil para gestión de inventario en campo. Pendiente de asignación de equipo."
        projectDueDate="2026-08-01"
        projectFTE={0}
        statusLabel={<StatusLabel statusId={4} statusOrder={4} isTerminal={false} statusName="Sin Asignar" />}
      />

    </div>
  </React.StrictMode>
);
