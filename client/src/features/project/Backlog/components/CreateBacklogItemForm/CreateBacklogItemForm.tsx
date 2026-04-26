import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  MinusIcon,
  ChevronDoubleDownIcon,
} from '@heroicons/react/24/outline';
import FormPopUp from '@/shared/components/FormPopUp';
import styles from './CreateBacklogItemForm.module.css';
import { useBacklogMeta } from '../../hooks/useBacklogMeta';
import { useCreateBacklogItem } from '../../hooks/useCreateBacklogItem';
import type { BacklogStatusRecord, BacklogPriorityRecord, CreateBacklogItemPayload } from '../../types/backlog.types';

// ── Status colour map by orden ────────────────────────────────────
const STATUS_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: '#F3F4F6', text: '#6B7280' },
  2: { bg: '#DBEAFE', text: '#1D4ED8' },
  3: { bg: '#FEF3C7', text: '#D97706' },
  4: { bg: '#D1FAE5', text: '#065F46' },
};

function statusStyle(s: BacklogStatusRecord) {
  return STATUS_COLORS[s.orden] ?? { bg: '#F3F4F6', text: '#6B7280' };
}

// ── Priority icon map by nombre ───────────────────────────────────
const PRIORITY_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  'Crítica': { icon: <ChevronDoubleUpIcon width={16} height={16} />, color: 'var(--color-mahindra-red)' },
  'Alta':    { icon: <ChevronUpIcon       width={16} height={16} />, color: '#f97316' },
  'Media':   { icon: <MinusIcon           width={16} height={16} />, color: 'var(--color-anchor-gray-1)' },
  'Baja':    { icon: <ChevronDownIcon     width={16} height={16} />, color: '#3b82f6' },
  'Mínima':  { icon: <ChevronDoubleDownIcon width={16} height={16} />, color: '#1d4ed8' },
};

function priorityConfig(p: BacklogPriorityRecord) {
  return PRIORITY_CONFIG[p.nombre] ?? { icon: <MinusIcon width={16} height={16} />, color: 'var(--color-anchor-gray-1)' };
}

// ── StatusPillSelect ──────────────────────────────────────────────
interface StatusPillSelectProps {
  statuses: BacklogStatusRecord[];
  value: string;
  onChange: (id: string) => void;
  required?: boolean;
}

function StatusPillSelect({ statuses, value, onChange, required }: StatusPillSelectProps) {
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

  const selected = statuses.find(s => String(s.id) === value);
  const { bg, text } = selected ? statusStyle(selected) : { bg: 'var(--color-clarity-gray-1)', text: 'var(--color-anchor-gray-1)' };

  return (
    <div className={styles.customSelect} ref={ref}>
      <button
        type="button"
        className={styles.pillTrigger}
        style={{ backgroundColor: bg, color: text }}
        onClick={() => setOpen(o => !o)}
        aria-required={required}
      >
        <span>{selected ? selected.nombre : 'Seleccionar...'}</span>
        <ChevronDownIcon width={12} height={12} />
      </button>

      {open && (
        <div className={styles.pillDropdown}>
          {!required && (
            <button
              type="button"
              className={styles.pillOption}
              style={{ backgroundColor: 'var(--color-clarity-gray-1)', color: 'var(--color-anchor-gray-1)' }}
              onClick={() => { onChange(''); setOpen(false); }}
            >
              Sin estatus
            </button>
          )}
          {statuses.map(s => {
            const { bg: sBg, text: sText } = statusStyle(s);
            return (
              <button
                key={s.id}
                type="button"
                className={`${styles.pillOption} ${String(s.id) === value ? styles.pillOptionActive : ''}`}
                style={{ backgroundColor: sBg, color: sText }}
                onClick={() => { onChange(String(s.id)); setOpen(false); }}
              >
                {s.nombre}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── PriorityIconSelect ────────────────────────────────────────────
interface PriorityIconSelectProps {
  priorities: BacklogPriorityRecord[];
  value: string;
  onChange: (id: string) => void;
}

function PriorityIconSelect({ priorities, value, onChange }: PriorityIconSelectProps) {
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

  const selected = priorities.find(p => String(p.id) === value);
  const selConfig = selected ? priorityConfig(selected) : null;

  return (
    <div className={styles.customSelect} ref={ref}>
      <button
        type="button"
        className={styles.iconTrigger}
        onClick={() => setOpen(o => !o)}
        style={{ color: selConfig?.color ?? 'var(--color-anchor-gray-1)' }}
      >
        <span className={styles.iconTriggerIcon}>{selConfig?.icon ?? <MinusIcon width={16} height={16} />}</span>
        <span className={styles.iconTriggerLabel}>{selected ? selected.nombre : 'Sin prioridad'}</span>
        <ChevronDownIcon width={12} height={12} className={styles.iconTriggerChevron} />
      </button>

      {open && (
        <div className={styles.iconDropdown}>
          <button
            type="button"
            className={`${styles.iconOption} ${!value ? styles.iconOptionActive : ''}`}
            onClick={() => { onChange(''); setOpen(false); }}
          >
            <MinusIcon width={16} height={16} style={{ color: 'var(--color-clarity-gray-2)' }} />
            <span>Sin prioridad</span>
          </button>
          {priorities.map(p => {
            const cfg = priorityConfig(p);
            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.iconOption} ${String(p.id) === value ? styles.iconOptionActive : ''}`}
                onClick={() => { onChange(String(p.id)); setOpen(false); }}
              >
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <span>{p.nombre}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main form ─────────────────────────────────────────────────────
interface CreateBacklogItemFormProps {
  projectId: number;
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

interface FormState {
  nombre: string;
  descripcion: string;
  id_tipo: string;
  id_estatus: string;
  id_prioridad: string;
  id_sprint: string;
  fecha_inicio: string;
  fecha_vencimiento: string;
  id_backlog_item_padre: string;
  id_usuario_responsable: string;
}

const EMPTY_FORM: FormState = {
  nombre: '', descripcion: '', id_tipo: '', id_estatus: '',
  id_prioridad: '', id_sprint: '', fecha_inicio: '', fecha_vencimiento: '',
  id_backlog_item_padre: '', id_usuario_responsable: '',
};

const CreateBacklogItemForm: React.FC<CreateBacklogItemFormProps> = ({
  projectId, userId, isOpen, onClose, onCreated,
}) => {
  const { meta, loading: metaLoading } = useBacklogMeta(projectId);
  const { submit, loading: submitting, error } = useCreateBacklogItem();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.id_estatus) return;
    const payload: CreateBacklogItemPayload = {
      nombre:                 form.nombre.trim(),
      descripcion:            form.descripcion || null,
      id_tipo:                form.id_tipo                ? Number(form.id_tipo)                : null,
      id_estatus:             Number(form.id_estatus),
      id_prioridad:           form.id_prioridad           ? Number(form.id_prioridad)           : null,
      id_sprint:              form.id_sprint              ? Number(form.id_sprint)              : null,
      fecha_inicio:           form.fecha_inicio           || null,
      fecha_vencimiento:      form.fecha_vencimiento      || null,
      id_backlog_item_padre:  form.id_backlog_item_padre  ? Number(form.id_backlog_item_padre)  : null,
      id_usuario_responsable: form.id_usuario_responsable ? Number(form.id_usuario_responsable) : null,
      id_proyecto:            projectId,
      id_usuario_creador:     userId,
    };
    try {
      await submit(payload);
      onCreated?.();
      onClose();
    } catch { /* shown via error state */ }
  };

  return (
    <FormPopUp
      eyebrow="Backlog"
      title="Nuevo ítem de backlog"
      subtitle="Completa los campos para agregar un nuevo ítem."
      isOpen={isOpen}
      onClose={onClose}
    >
      {metaLoading ? (
        <p className={styles.loading}>Cargando opciones...</p>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>

          {/* Nombre */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="nombre">
              Nombre <span className={styles.required}>*</span>
            </label>
            <input id="nombre" name="nombre" className={styles.input} type="text"
              placeholder="Nombre del ítem" value={form.nombre} onChange={handleChange} required />
          </div>

          {/* Descripción */}
          <div className={styles.field}>
            <label className={styles.label} htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" name="descripcion" className={styles.textarea}
              placeholder="Descripción opcional..." rows={3} value={form.descripcion} onChange={handleChange} />
          </div>

          {/* Row: Tipo + Estatus */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo</label>
              <select name="id_tipo" className={styles.select} value={form.id_tipo} onChange={handleChange}>
                <option value="">Sin tipo</option>
                {meta.types.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Estatus <span className={styles.required}>*</span>
              </label>
              <StatusPillSelect
                statuses={meta.statuses}
                value={form.id_estatus}
                onChange={v => setForm(f => ({ ...f, id_estatus: v }))}
                required
              />
            </div>
          </div>

          {/* Row: Prioridad + Sprint */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Prioridad</label>
              <PriorityIconSelect
                priorities={meta.priorities}
                value={form.id_prioridad}
                onChange={v => setForm(f => ({ ...f, id_prioridad: v }))}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sprint</label>
              <select name="id_sprint" className={styles.select} value={form.id_sprint} onChange={handleChange}>
                <option value="">Sin sprint</option>
                {meta.sprints.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Item padre + Responsable */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Ítem padre</label>
              <select name="id_backlog_item_padre" className={styles.select} value={form.id_backlog_item_padre} onChange={handleChange}>
                <option value="">Sin ítem padre</option>
                {meta.items.map(item => (
                  <option key={item.id} value={item.id}>
                    HU-{String(item.id).padStart(2, '0')} — {item.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Responsable</label>
              <select name="id_usuario_responsable" className={styles.select} value={form.id_usuario_responsable} onChange={handleChange}>
                <option value="">Sin responsable</option>
                {meta.users.map(user => (
                  <option key={user.id} value={user.id}>
                    {[user.nombre, user.apellido].filter(Boolean).join(' ') || user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Fechas */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Fecha inicio</label>
              <input name="fecha_inicio" className={styles.input} type="date" value={form.fecha_inicio} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Fecha vencimiento</label>
              <input name="fecha_vencimiento" className={styles.input} type="date" value={form.fecha_vencimiento} onChange={handleChange} />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitBtn}
              disabled={submitting || !form.nombre.trim() || !form.id_estatus}>
              {submitting ? 'Guardando...' : 'Crear ítem'}
            </button>
          </div>
        </form>
      )}
    </FormPopUp>
  );
};

export default CreateBacklogItemForm;
