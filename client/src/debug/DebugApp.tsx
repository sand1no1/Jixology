import React, { useMemo, useState } from 'react';
import '@/app/index.css';

import ProjectCard from '@/features/projects/components/ProjectCard';
import StatusLabel from '@/shared/components/StatusLabel';
import LogInPage from '@/features/auth/pages/LogInPage';
import Profile from '@/features/profile/pages';
import SearchBarComponent from '@/shared/components/SearchBarComponent';
import ProjectsPage from '@/features/projects/pages/ProjectsPage';
import UserCard from '@/features/profile/components/UserCard/UserCard';
import ListUserCard from '@/features/profile/components/ListUserCard';
import type { Role } from '@/features/profile/components/ListUserCard/ListUserCard';
import { useUsuario } from '@/features/user/hooks/useUsuario';

type DebugViewKey = 'login' | 'projects' | 'profile' | 'searchBar' | 'projectsPage' | 'userCard' | 'listUserCard';

// ── DB-connected wrappers (hooks require real components) ─────────────────────

function calcAge(fechaNacimiento: string): number {
  const birth = new Date(fechaNacimiento);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function DbUserCard({ userId }: { userId: number }) {
  const { usuario, loading } = useUsuario(userId);
  if (loading || !usuario) return null;

  const nombre    = [usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || '—';
  const birthDate = usuario.fecha_nacimiento
    ? new Date(usuario.fecha_nacimiento).toLocaleDateString('es-MX')
    : '—';
  const age = usuario.fecha_nacimiento ? calcAge(usuario.fecha_nacimiento) : 0;

  return (
    <UserCard
      userId={userId}
      name={nombre}
      age={age}
      birthDate={birthDate}
      phone={usuario.telefono ?? '—'}
      email={usuario.email}
      aboutMe={usuario.sobre_mi ?? ''}
    />
  );
}

function DbListUserCard({ userId, roles }: { userId: number; roles: Role[] }) {
  const { usuario, loading } = useUsuario(userId);
  if (loading || !usuario) return null;

  const fullName = [usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || '—';

  return (
    <ListUserCard
      userId={userId}
      fullName={fullName}
      roles={roles}
      email={usuario.email}
    />
  );
}

// ── Debug app ─────────────────────────────────────────────────────────────────

export default function DebugApp() {
  const views = useMemo<Record<DebugViewKey, React.ReactNode>>(
    () => ({
      login: <LogInPage />,

      projects: (
        <div
          style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxSizing: 'border-box',
          }}
        >
          <h2 style={{ fontFamily: 'monospace', margin: 0 }}>Debug Playground</h2>

          <ProjectCard
            projectId={1}
            projectName="Proyecto Alpha"
            projectStatus={1}
            projectStack={['React', 'TypeScript', 'Supabase']}
            completition={100}
            projectDescription="Migración completa del sistema legacy a arquitectura moderna con React y Supabase."
            projectDueDate="2026-03-01"
            projectFTE={3}
            statusLabel={
              <StatusLabel
                statusId={1}
                statusOrder={1}
                isTerminal={true}
                statusName="Completado"
              />
            }
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
            statusLabel={
              <StatusLabel
                statusId={2}
                statusOrder={2}
                isTerminal={false}
                statusName="En Progreso"
              />
            }
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
            statusLabel={
              <StatusLabel
                statusId={3}
                statusOrder={3}
                isTerminal={false}
                statusName="Retrasado"
              />
            }
          />
          <ProjectCard
            projectId={4}
            projectName="Proyecto Delta"
            projectStatus={4}
            projectStack={['React Native daennieifen', 'Firebase efaerafva', '...']}
            completition={0}
            projectDescription="App móvil para gestión de inventario en campo. Pendiente de asignación de equipo."
            projectDueDate="2026-08-01"
            projectFTE={0}
            statusLabel={
              <StatusLabel
                statusId={4}
                statusOrder={4}
                isTerminal={false}
                statusName="Sin Asignar"
              />
            }
          />
        </div>
      ),

      searchBar: (
        <div style={{ padding: '1.5rem' }}>
          <SearchBarComponent infoText="Buscar proyectos..." />
        </div>
      ),

      projectsPage: <ProjectsPage />,

      userCard: <DbUserCard userId={1} />,

      listUserCard: (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <DbListUserCard
            userId={1}
            roles={[
              { label: 'QA',    color: '#FEF3C7', textColor: '#D97706' },
              { label: 'Front', color: '#EDE9FE', textColor: '#7C3AED' },
            ]}
          />
          <DbListUserCard
            userId={2}
            roles={[
              { label: 'Back',   color: '#DBEAFE', textColor: '#1D4ED8' },
              { label: 'DevOps', color: '#D1FAE5', textColor: '#065F46' },
            ]}
          />
          <DbListUserCard
            userId={1}
            roles={[
              { label: 'PM', color: '#FCE7F3', textColor: '#BE185D' },
            ]}
          />
        </div>
      ),

      profile: <Profile />,
    }),
    []
  );

  const [activeView, setActiveView] = useState<DebugViewKey>('profile');

  return (
    <React.StrictMode>
      <div
        style={{
          minHeight: '100%',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem',
            borderBottom: '0.0625rem solid #d9d9d9',
            backgroundColor: '#ffffff',
            flexWrap: 'wrap',
          }}
        >
          {(Object.keys(views) as DebugViewKey[]).map((viewKey) => (
            <button
              key={viewKey}
              type="button"
              onClick={() => setActiveView(viewKey)}
              style={{
                padding: '0.625rem 1rem',
                borderRadius: '999rem',
                border: '0.0625rem solid #cfcfcf',
                backgroundColor: activeView === viewKey ? '#1f3650' : '#ffffff',
                color: activeView === viewKey ? '#ffffff' : '#222222',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {viewKey}
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--color-clarity-gray-1)', minHeight: '100vh' }}>
          {views[activeView]}
        </div>
      </div>
    </React.StrictMode>
  );
}