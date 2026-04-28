import React from 'react';
import {
  XMarkIcon,
  UserIcon,
  BoltIcon,
  BugAntIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import { useUserAvatarSvg } from '@/features/profile/hooks/useUserAvatarSvg';
import type { BacklogItemRecord, BacklogMeta } from '@/features/project/Backlog/types/backlog.types';
import styles from './BacklogViewDetails.module.css';

// ── Constants ────────────────────────────────────────────────────────
const STATUS_COLORS: Record<number, { color: string; textColor: string }> = {
  1: { color: '#F3F4F6', textColor: '#6B7280' },
  2: { color: '#DBEAFE', textColor: '#1D4ED8' },
  3: { color: '#FEF3C7', textColor: '#D97706' },
  4: { color: '#D1FAE5', textColor: '#065F46' },
};

const TYPE_PREFIX: Record<string, string> = {
  'Historia de Usuario': 'HU',
  'Tarea':               'TA',
  'Bug':                 'BG',
  'Épica':               'EP',
  'Subtarea':            'ST',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Bug:                   <BugAntIcon     width={14} height={14} />,
  'Historia de Usuario': <BookOpenIcon   width={14} height={14} />,
  'Épica':               <BoltIcon       width={14} height={14} />,
  Tarea: (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
      <path d="M5 8L7.5 10.5L11 5.5" />
    </svg>
  ),
  Subtarea: (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1.5" y1="0.5" x2="1.5" y2="12.5" />
      <line x1="1.5" y1="4"   x2="5" y2="4" />
      <line x1="1.5" y1="12.5" x2="5" y2="12.5" />
      <rect x="5" y="1" width="6" height="6" />
      <path d="M6.5 4L7.5 6.5L11.5 1.5" />
      <rect x="5" y="9.5" width="6" height="6" />
      <path d="M6.5 12.5L7.5 15L11.5 10" />
    </svg>
  ),
};

const PRIORITY_OPTIONS: Record<string, { icon: React.ReactNode; color: string }> = {
  'Crítica': { icon: <ChevronDoubleUpIcon   width={14} height={14} />, color: 'var(--color-mahindra-red)' },
  'Alta':    { icon: <ChevronUpIcon         width={14} height={14} />, color: '#f97316' },
  'Media':   { icon: <MinusIcon             width={14} height={14} />, color: 'var(--color-anchor-gray-1)' },
  'Baja':    { icon: <ChevronDownIcon       width={14} height={14} />, color: '#3b82f6' },
  'Mínima':  { icon: <ChevronDoubleDownIcon width={14} height={14} />, color: '#1d4ed8' },
};

// ── Sub-components ────────────────────────────────────────────────────
function UserAvatar({ userId }: { userId: number }) {
  const { avatarSvg } = useUserAvatarSvg(userId);
  return (
    <div className={styles.avatarCircle}>
      {avatarSvg
        ? <div className={styles.avatarSvg} dangerouslySetInnerHTML={{ __html: avatarSvg }} />
        : <UserIcon width={12} height={12} />
      }
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────
interface BacklogViewDetailsProps {
  item: BacklogItemRecord;
  meta: BacklogMeta;
  onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────
const BacklogViewDetails: React.FC<BacklogViewDetailsProps> = ({ item, meta, onClose }) => {
  const typeRecord     = meta.types.find(t => t.id === item.id_tipo);
  const statusRecord   = meta.statuses.find(s => s.id === item.id_estatus);
  const priorityRecord = meta.priorities.find(p => p.id === item.id_prioridad);
  const sprintRecord   = meta.sprints.find(s => s.id === item.id_sprint);
  const assignee       = meta.users.find(u => u.id === item.id_usuario_responsable);
  const creator        = meta.users.find(u => u.id === item.id_usuario_creador);
  const subtasks       = meta.items.filter(i => i.id_backlog_item_padre === item.id);
  const parentItem     = item.id_backlog_item_padre != null
    ? meta.items.find(i => i.id === item.id_backlog_item_padre)
    : null;

  const typeName   = typeRecord?.nombre ?? '';
  const prefix     = TYPE_PREFIX[typeName] ?? 'IT';
  const code       = `${prefix}-${String(item.id).padStart(2, '0')}`;
  const statusColors = statusRecord ? (STATUS_COLORS[statusRecord.orden] ?? STATUS_COLORS[1]) : STATUS_COLORS[1];
  const priority   = priorityRecord ? PRIORITY_OPTIONS[priorityRecord.nombre] : null;

  const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

  const fullName = (u: { nombre: string | null; apellido: string | null; email: string } | undefined) =>
    u ? ([u.nombre, u.apellido].filter(Boolean).join(' ') || u.email) : null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>

        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <span className={styles.codeBadge}>
            {TYPE_ICONS[typeName] ?? null}
            {code}
          </span>
          <div className={styles.topBarActions}>
            <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Cerrar">
              <XMarkIcon width={18} height={18} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* ── Main content ── */}
          <div className={styles.main}>
            <h1 className={styles.title}>{item.nombre}</h1>

            <div className={styles.statusRow}>
              <span
                className={styles.statusBadge}
                style={{ backgroundColor: statusColors.color, color: statusColors.textColor }}
              >
                {statusRecord?.nombre ?? '—'}
              </span>
            </div>

            {/* Description */}
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Descripción</span>
              {item.descripcion
                ? <p className={styles.description}>{item.descripcion}</p>
                : <span className={styles.noDescription}>Sin descripción.</span>
              }
            </div>

            {/* Subtasks */}
            <div className={styles.section}>
              <span className={styles.sectionTitle}>Subtareas</span>
              {subtasks.length === 0
                ? <span className={styles.noSubtasks}>Sin subtareas.</span>
                : (
                  <div className={styles.subtaskList}>
                    {subtasks.map(sub => {
                      const subType   = meta.types.find(t => t.id === sub.id_tipo);
                      const subStatus = meta.statuses.find(s => s.id === sub.id_estatus);
                      const subColors = subStatus ? (STATUS_COLORS[subStatus.orden] ?? STATUS_COLORS[1]) : STATUS_COLORS[1];
                      const subPrefix = TYPE_PREFIX[subType?.nombre ?? ''] ?? 'IT';
                      return (
                        <div key={sub.id} className={styles.subtaskRow}>
                          <span className={styles.subtaskCode}>{subPrefix}-{String(sub.id).padStart(2, '0')}</span>
                          <span className={styles.subtaskName}>{sub.nombre}</span>
                          <span
                            className={styles.subtaskStatus}
                            style={{ backgroundColor: subColors.color, color: subColors.textColor }}
                          >
                            {subStatus?.nombre ?? '—'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )
              }
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className={styles.sidebar}>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tipo</span>
              {typeName
                ? <span className={styles.detailValue}>{TYPE_ICONS[typeName]}{typeName}</span>
                : <span className={styles.detailEmpty}>Sin tipo</span>
              }
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Prioridad</span>
              {priority && priorityRecord
                ? (
                  <span className={styles.detailValue}>
                    <span className={styles.priorityChip} style={{ color: priority.color }}>
                      {priority.icon}
                      {priorityRecord.nombre}
                    </span>
                  </span>
                )
                : <span className={styles.detailEmpty}>Sin prioridad</span>
              }
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Sprint</span>
              {sprintRecord
                ? <span className={styles.detailValue}>{sprintRecord.nombre}</span>
                : <span className={styles.detailEmpty}>Sin sprint</span>
              }
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Responsable</span>
              {assignee
                ? (
                  <span className={styles.detailValue}>
                    <UserAvatar userId={assignee.id} />
                    {fullName(assignee)}
                  </span>
                )
                : <span className={styles.detailEmpty}>Sin asignar</span>
              }
            </div>

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Creado por</span>
              {creator
                ? (
                  <span className={styles.detailValue}>
                    <UserAvatar userId={creator.id} />
                    {fullName(creator)}
                  </span>
                )
                : <span className={styles.detailEmpty}>—</span>
              }
            </div>

            {parentItem && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Ítem padre</span>
                <span className={styles.detailValue}>
                  {TYPE_PREFIX[meta.types.find(t => t.id === parentItem.id_tipo)?.nombre ?? ''] ?? 'IT'}
                  -{String(parentItem.id).padStart(2, '0')} {parentItem.nombre}
                </span>
              </div>
            )}

            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Fecha de creación</span>
              <span className={styles.detailValue}>
                <CalendarDaysIcon width={13} height={13} />
                {formatDate(item.fecha_creacion)}
              </span>
            </div>

            {item.fecha_inicio && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Fecha de inicio</span>
                <span className={styles.detailValue}>
                  <CalendarDaysIcon width={13} height={13} />
                  {formatDate(item.fecha_inicio)}
                </span>
              </div>
            )}

            {item.fecha_vencimiento && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Fecha de vencimiento</span>
                <span className={styles.detailValue}>
                  <CalendarDaysIcon width={13} height={13} />
                  {formatDate(item.fecha_vencimiento)}
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogViewDetails;
