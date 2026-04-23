import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import BacklogListItem from '@/features/projectView/components/BacklogListItem';
import type { BacklogStatus, Priority } from '@/features/projectView/components/BacklogListItem';
import CreateBacklogItemForm from '@/features/backlogItem/components/CreateBacklogItemForm';
import SkeletonBacklogItem from '@/features/backlogItem/components/SkeletonBacklogItem/SkeletonBacklogItem';
import { useBacklogItems } from '@/features/backlogItem/hooks/useBacklogItems';
import { useBacklogMeta } from '@/features/backlogItem/hooks/useBacklogMeta';
import type { BacklogStatusRecord, BacklogPriorityRecord } from '@/features/backlogItem/types/backlog.types';
import styles from './ProjectBacklog.module.css';

const PROJECT_ID = 1;
const USER_ID = 1;

const STATUS_COLORS: Record<number, { color: string; textColor: string }> = {
  1: { color: '#F3F4F6', textColor: '#6B7280' },
  2: { color: '#DBEAFE', textColor: '#1D4ED8' },
  3: { color: '#FEF3C7', textColor: '#D97706' },
  4: { color: '#D1FAE5', textColor: '#065F46' },
};

const PRIORITY_MAP: Record<string, Priority> = {
  'Crítica': 'critical',
  'Alta':    'high',
  'Media':   'medium',
  'Baja':    'low',
  'Mínima':  'minimal',
};

function toBacklogStatus(record: BacklogStatusRecord): BacklogStatus {
  const colors = STATUS_COLORS[record.orden] ?? { color: '#F3F4F6', textColor: '#6B7280' };
  return { label: record.nombre, ...colors };
}

function toPriority(record: BacklogPriorityRecord | undefined): Priority {
  if (!record) return 'medium';
  return PRIORITY_MAP[record.nombre] ?? 'medium';
}

const ProjectBacklog: React.FC = () => {
  const { items, loading: itemsLoading, refresh } = useBacklogItems(PROJECT_ID);
  const { meta, loading: metaLoading } = useBacklogMeta(PROJECT_ID);
  const [showForm, setShowForm] = useState(false);

  const loading = itemsLoading || metaLoading;
  const allStatuses = meta.statuses.map(toBacklogStatus);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.newItemBtn}
          onClick={() => setShowForm(true)}
        >
          <PlusIcon width={16} height={16} />
          Nuevo ítem
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonBacklogItem key={i} />)
        ) : items.length === 0 ? (
          <p className={styles.empty}>No hay ítems en el backlog.</p>
        ) : (
          items.map(item => {
            const statusRecord  = meta.statuses.find(s => s.id === item.id_estatus);
            const priorityRecord = meta.priorities.find(p => p.id === item.id_prioridad);
            const status: BacklogStatus = statusRecord
              ? toBacklogStatus(statusRecord)
              : { label: 'Sin estatus', color: '#F3F4F6', textColor: '#6B7280' };

            return (
              <BacklogListItem
                key={item.id}
                code={`HU-${String(item.id).padStart(2, '0')}`}
                title={item.nombre}
                status={status}
                statuses={allStatuses}
                priority={toPriority(priorityRecord)}
              />
            );
          })
        )}
      </div>

      {showForm && (
        <CreateBacklogItemForm
          projectId={PROJECT_ID}
          userId={USER_ID}
          onClose={() => setShowForm(false)}
          onCreated={() => { refresh(); setShowForm(false); }}
        />
      )}
    </div>
  );
};

export default ProjectBacklog;
