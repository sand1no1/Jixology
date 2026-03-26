import React from 'react';
import { createRoot } from 'react-dom/client';
import Debug from '@/common/ui/Debug';
import StatusLabel from '@/common/ui/StatusLabel';
import './index.css';

const sampleData = {
  id: 1,
  nombre: 'Proyecto Alpha',
  activo: true,
  stack: ['React', 'TypeScript', 'Supabase'],
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontFamily: 'monospace' }}>Debug Playground</h2>

      <Debug label="StatusLabel" data={sampleData}>
        <StatusLabel statusId={1} statusOrder={1} isTerminal={false}>
          En progreso
        </StatusLabel>
      </Debug>

    </div>
  </React.StrictMode>
);
