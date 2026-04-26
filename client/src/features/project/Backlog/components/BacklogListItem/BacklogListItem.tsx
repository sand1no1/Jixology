import React, { useEffect, useRef, useState } from 'react';
import {
  BugAntIcon,
  BriefcaseIcon,
  ListBulletIcon,
  BookOpenIcon,
  BoltIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  MinusIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import ContextMenu from '@/shared/components/ContextMenu';
import { useUserAvatarSvg } from '@/features/profile/hooks/useUserAvatarSvg';
import styles from './BacklogListItem.module.css';

export type BacklogItemType = 'Bug' | 'Tarea' | 'Subtarea' | 'Historia de Usuario' | 'Épica';

const TYPE_ICONS: Record<BacklogItemType, React.ReactNode> = {
  Bug:                   <BugAntIcon     width={16} height={16} />,
  Tarea:                 <BriefcaseIcon  width={16} height={16} />,
  Subtarea:              <ListBulletIcon width={16} height={16} />,
  'Historia de Usuario': <BookOpenIcon   width={16} height={16} />,
  'Épica':               <BoltIcon       width={16} height={16} />,
};

export interface BacklogStatus {
  label: string;
  color: string;
  textColor: string;
}

export type Priority = 'critical' | 'high' | 'medium' | 'low' | 'minimal';

interface PriorityOption {
  value: Priority;
  icon: React.ReactNode;
  label: string;
  color: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'critical', icon: <ChevronDoubleUpIcon   width={16} height={16} />, label: 'Crítica', color: 'var(--color-mahindra-red)' },
  { value: 'high',     icon: <ChevronUpIcon         width={16} height={16} />, label: 'Alta',    color: '#f97316' },
  { value: 'medium',   icon: <MinusIcon             width={16} height={16} />, label: 'Media',   color: 'var(--color-anchor-gray-1)' },
  { value: 'low',      icon: <ChevronDownIcon       width={16} height={16} />, label: 'Baja',    color: '#3b82f6' },
  { value: 'minimal',  icon: <ChevronDoubleDownIcon width={16} height={16} />, label: 'Mínima',  color: '#1d4ed8' },
];

// ── UserAvatar ────────────────────────────────────────────────────
function UserAvatar({ userId }: { userId: number }) {
  const { avatarSvg } = useUserAvatarSvg(userId);
  return (
    <div className={styles.avatarCircle}>
      {avatarSvg
        ? <div className={styles.avatarSvg} dangerouslySetInnerHTML={{ __html: avatarSvg }} />
        : <UserIcon width={14} height={14} />
      }
    </div>
  );
}

type OpenDropdown = 'status' | 'priority' | 'menu' | null;

interface BacklogListItemProps {
  code: string;
  title: string;
  status: BacklogStatus;
  statuses?: BacklogStatus[];
  priority?: Priority;
  itemType?: BacklogItemType;
  responsibleUserId?: number;
  onStatusChange?: (status: BacklogStatus) => void;
  onPriorityChange?: (priority: Priority) => void;
  onAssign?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BacklogListItem: React.FC<BacklogListItemProps> = ({
  code,
  title,
  status,
  statuses = [],
  priority = 'medium',
  itemType = 'Tarea',
  responsibleUserId,
  onStatusChange,
  onPriorityChange,
  onAssign,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen]                       = useState<OpenDropdown>(null);
  const [currentStatus, setCurrentStatus]     = useState<BacklogStatus>(status);
  const [currentPriority, setCurrentPriority] = useState<Priority>(priority ?? 'medium');
  const rowRef = useRef<HTMLDivElement>(null);

  // Close any open dropdown/menu on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (rowRef.current && !rowRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const currentPriorityOption = PRIORITY_OPTIONS.find(o => o.value === currentPriority) ?? PRIORITY_OPTIONS[2];

  const menuItems = [
    { text: 'Editar',    onClick: () => { setOpen(null); onEdit?.();   } },
    { text: 'Eliminar',  onClick: () => { setOpen(null); onDelete?.(); } },
  ];

  return (
    <div className={styles.row} ref={rowRef}>
      {/* Type icon */}
      <span className={styles.typeIcon} aria-label={itemType}>
        {TYPE_ICONS[itemType]}
      </span>

      {/* Code */}
      <span className={styles.code}>{code}</span>

      {/* Title */}
      <span className={styles.title}>{title}</span>

      {/* Status — with dropdown */}
      <div className={styles.statusWrapper}>
        <button
          className={styles.statusBtn}
          style={{ backgroundColor: currentStatus.color, color: currentStatus.textColor }}
          onClick={() => setOpen(o => o === 'status' ? null : 'status')}
          type="button"
          aria-label={`Estado: ${currentStatus.label}`}
          aria-expanded={open === 'status'}
        >
          <span className={styles.statusLabel}>{currentStatus.label}</span>
          <ChevronDownIcon width={12} height={12} />
        </button>

        {open === 'status' && statuses.length > 0 && (
          <div className={styles.statusDropdown} role="menu">
            {statuses.map(s => (
              <button
                key={s.label}
                className={`${styles.statusOption} ${s.label === currentStatus.label ? styles.statusOptionActive : ''}`}
                type="button"
                role="menuitem"
                onClick={() => { setCurrentStatus(s); onStatusChange?.(s); setOpen(null); }}
                style={{ backgroundColor: s.color, color: s.textColor }}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Priority — with dropdown */}
      <div className={styles.priorityWrapper}>
        <button
          className={`${styles.iconBtn} ${styles.priorityBtn}`}
          type="button"
          aria-label={`Prioridad: ${currentPriorityOption.label}`}
          aria-expanded={open === 'priority'}
          style={{ color: currentPriorityOption.color }}
          onClick={() => setOpen(o => o === 'priority' ? null : 'priority')}
        >
          {currentPriorityOption.icon}
        </button>

        {open === 'priority' && (
          <div className={styles.dropdown} role="menu">
            {PRIORITY_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`${styles.dropdownItem} ${option.value === currentPriority ? styles.dropdownItemActive : ''}`}
                type="button"
                role="menuitem"
                aria-label={option.label}
                style={{ color: option.color }}
                onClick={() => { setCurrentPriority(option.value); onPriorityChange?.(option.value); setOpen(null); }}
              >
                {option.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Assignee */}
      {responsibleUserId != null
        ? <UserAvatar userId={responsibleUserId} />
        : <button className={styles.iconBtn} onClick={onAssign} type="button" aria-label="Asignar">
            <UserIcon width={16} height={16} />
          </button>
      }

      {/* More options — context menu */}
      <div className={styles.menuWrapper}>
        <button
          className={`${styles.iconBtn} ${open === 'menu' ? styles.iconBtnActive : ''}`}
          type="button"
          aria-label="Más opciones"
          aria-expanded={open === 'menu'}
          onClick={() => setOpen(o => o === 'menu' ? null : 'menu')}
        >
          <EllipsisVerticalIcon width={16} height={16} />
        </button>

        {open === 'menu' && (
          <div className={styles.contextMenuPopover}>
            <ContextMenu elements={menuItems} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BacklogListItem;
