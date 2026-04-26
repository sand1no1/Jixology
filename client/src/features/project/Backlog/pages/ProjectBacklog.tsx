import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import BacklogListItem from '@/features/project/Backlog/components/BacklogListItem';
import type { BacklogStatus, Priority, BacklogItemType } from '@/features/project/Backlog/components/BacklogListItem';
import CreateBacklogItemForm from '@/features/project/Backlog/components/CreateBacklogItemForm';
import EditBacklogItemForm from '@/features/project/Backlog/components/EditBacklogItemForm/EditBacklogItemForm';
import SkeletonBacklogItem from '@/features/project/Backlog/components/SkeletonBacklogItem/SkeletonBacklogItem';
import FilterBar from '@/shared/components/FilterBar';
import ContextMenu from '@/shared/components/ContextMenu';
import type { MenuComponent } from '@/shared/components/ContextMenu';
import { useBacklogItems } from '@/features/project/Backlog/hooks/useBacklogItems';
import { useBacklogMeta } from '@/features/project/Backlog/hooks/useBacklogMeta';
import type { BacklogItemRecord, BacklogStatusRecord, BacklogPriorityRecord } from '@/features/project/Backlog/types/backlog.types';
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

// ── FilterBubble ──────────────────────────────────────────────────
interface FilterBubbleProps {
  label: string;
  selectedLabel?: string;
  elements: MenuComponent[];
}

function FilterBubble({ label, selectedLabel, elements }: FilterBubbleProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const isActive = !!selectedLabel;

  return (
    <div ref={ref} className={styles.bubble}>
      <button
        type="button"
        className={`${styles.bubbleBtn} ${isActive ? styles.bubbleBtnActive : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span>{isActive ? selectedLabel : label}</span>
        <ChevronDownIcon width={12} height={12} />
      </button>
      {open && (
        <div className={styles.bubbleMenu} onClick={() => setOpen(false)}>
          <ContextMenu elements={elements} />
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
const ProjectBacklog: React.FC = () => {
  const { items, loading: itemsLoading, refresh } = useBacklogItems(PROJECT_ID);
  const { meta, loading: metaLoading } = useBacklogMeta(PROJECT_ID);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingItem, setEditingItem] = useState<BacklogItemRecord | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<number | null>(null);
  const [filterType,   setFilterType]   = useState<number | null>(null);
  const [filterUser,   setFilterUser]   = useState<number | null>(null);
  const [filterSprint, setFilterSprint] = useState<number | null>(null);

  const loading = itemsLoading || metaLoading;
  const allStatuses = meta.statuses.map(toBacklogStatus);

  const filteredItems = useMemo(() => {
    return items
      .filter(item => filterStatus === null || item.id_estatus          === filterStatus)
      .filter(item => filterType   === null || item.id_tipo             === filterType)
      .filter(item => filterUser   === null || item.id_usuario_responsable === filterUser)
      .filter(item => filterSprint === null || item.id_sprint           === filterSprint)
      .filter(item => item.nombre.toLowerCase().includes(search.toLowerCase()));
  }, [items, search, filterStatus, filterType, filterUser, filterSprint]);

  // ── Bubble menu options ───────────────────────────────────────────
  const statusOptions: MenuComponent[] = [
    { text: 'Todos', onClick: () => setFilterStatus(null) },
    ...meta.statuses.map(s => ({ text: s.nombre, onClick: () => setFilterStatus(s.id) })),
  ];

  const typeOptions: MenuComponent[] = [
    { text: 'Todos', onClick: () => setFilterType(null) },
    ...meta.types.map(t => ({ text: t.nombre, onClick: () => setFilterType(t.id) })),
  ];

  const userOptions: MenuComponent[] = [
    { text: 'Todos', onClick: () => setFilterUser(null) },
    ...meta.users.map(u => ({
      text: [u.nombre, u.apellido].filter(Boolean).join(' ') || u.email,
      onClick: () => setFilterUser(u.id),
    })),
  ];

  const sprintOptions: MenuComponent[] = [
    { text: 'Todos', onClick: () => setFilterSprint(null) },
    ...meta.sprints.map(s => ({ text: s.nombre, onClick: () => setFilterSprint(s.id) })),
  ];

  // ── Selected labels ───────────────────────────────────────────────
  const selectedStatusLabel = filterStatus !== null
    ? meta.statuses.find(s => s.id === filterStatus)?.nombre
    : undefined;

  const selectedTypeLabel = filterType !== null
    ? meta.types.find(t => t.id === filterType)?.nombre
    : undefined;

  const selectedUserLabel = filterUser !== null ? (() => {
    const u = meta.users.find(u => u.id === filterUser);
    return u ? ([u.nombre, u.apellido].filter(Boolean).join(' ') || u.email) : undefined;
  })() : undefined;

  const selectedSprintLabel = filterSprint !== null
    ? meta.sprints.find(s => s.id === filterSprint)?.nombre
    : undefined;

  return (
    <div className={styles.container}>

      <FilterBar
        searchPlaceholder="Buscar ítems..."
        onSearchChange={setSearch}
        filters={[]}
        activeFilter={null}
        onFilterChange={() => {}}
      >
        <button
          type="button"
          className={styles.newItemBtn}
          onClick={() => setShowCreateForm(true)}
        >
          <PlusIcon width={16} height={16} />
          Nuevo ítem
        </button>
      </FilterBar>

      <div className={styles.bubbles}>
        <FilterBubble label="Estatus"     selectedLabel={selectedStatusLabel} elements={statusOptions} />
        <FilterBubble label="Tipo"        selectedLabel={selectedTypeLabel}   elements={typeOptions} />
        <FilterBubble label="Responsable" selectedLabel={selectedUserLabel}   elements={userOptions} />
        <FilterBubble label="Sprint"      selectedLabel={selectedSprintLabel} elements={sprintOptions} />
      </div>

      <div className={styles.list}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonBacklogItem key={i} />)
        ) : filteredItems.length === 0 ? (
          <p className={styles.empty}>No hay ítems en el backlog.</p>
        ) : (
          filteredItems.map(item => {
            const statusRecord   = meta.statuses.find(s => s.id === item.id_estatus);
            const priorityRecord = meta.priorities.find(p => p.id === item.id_prioridad);
            const typeRecord     = meta.types.find(t => t.id === item.id_tipo);
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
                itemType={typeRecord?.nombre as BacklogItemType | undefined}
                responsibleUserId={item.id_usuario_responsable ?? undefined}
                onEdit={() => setEditingItem(item)}
              />
            );
          })
        )}
      </div>

      <CreateBacklogItemForm
        projectId={PROJECT_ID}
        userId={USER_ID}
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreated={() => { refresh(); setShowCreateForm(false); }}
      />

      {editingItem && (
        <EditBacklogItemForm
          item={editingItem}
          meta={meta}
          onClose={() => setEditingItem(null)}
          onUpdated={() => { refresh(); setEditingItem(null); }}
        />
      )}
    </div>
  );
};

export default ProjectBacklog;
