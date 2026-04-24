import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDownIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  MinusIcon,
  ChevronDoubleDownIcon,
} from '@heroicons/react/24/outline';
import FormPopUp from '@/shared/components/FormPopUp';
import type { BacklogItemRecord, BacklogStatusRecord, BacklogPriorityRecord, UpdateBacklogItemPayload } from '../../types/backlog.types';
import type { BacklogMeta } from '../../types/backlog.types';
import { updateBacklogItem } from '../../services/backlog.service';
import styles from './EditBacklogItemForm.module.css';

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

// ── Priority icon map ─────────────────────────────────────────────
const PRIORITY_CONFIG: Record<string, { icon: React.ReactNode; color: string }> = {
  'Crítica': { icon: <ChevronDoubleUpIcon   width={16} height={16} />, color: 'var(--color-mahindra-red)' },
  'Alta':    { icon: <ChevronUpIcon         width={16} height={16} />, color: '#f97316' },
  'Media':   { icon: <MinusIcon             width={16} height={16} />, color: 'var(--color-anchor-gray-1)' },
  'Baja':    { icon: <ChevronDownIcon       width={16} height={16} />, color: '#3b82f6' },
  'Mínima':  { icon: <ChevronDoubleDownIcon width={16} height={16} />, color: '#1d4ed8' },
};

// ── StatusPillSelect ──────────────────────────────────────────────
function StatusPillSelect({ statuses, value, onChange }: {
  statuses: BacklogStatusRecord[];
  value: string;
  onChange: (id: string) => void;
}) {
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
      <button type="button" className={styles.pillTrigger}
        style={{ backgroundColor: bg, color: text }}
        onClick={() => setOpen(o => !o)}
      >
        <span>{selected?.nombre ?? 'Seleccionar...'}</span>
        <ChevronDownIcon width={12} height={12} />
      </button>
      {open && (
        <div className={styles.pillDropdown}>
          {statuses.map(s => {
            const { bg: sBg, text: sText } = statusStyle(s);
            return (
              <button key={s.id} type="button"
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
function PriorityIconSelect({ priorities, value, onChange }: {
  priorities: BacklogPriorityRecord[];
  value: string;
  onChange: (id: string) => void;
}) {
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
  const cfg = selected ? (PRIORITY_CONFIG[selected.nombre] ?? null) : null;

  return (
    <div className={styles.customSelect} ref={ref}>
      <button type="button" className={styles.iconTrigger}
        onClick={() => setOpen(o => !o)}
        style={{ color: cfg?.color ?? 'var(--color-anchor-gray-1)' }}
      >
        <span className={styles.iconTriggerIcon}>{cfg?.icon ?? <MinusIcon width={16} height={16} />}</span>
        <span className={styles.iconTriggerLabel}>{selected?.nombre ?? 'Sin prioridad'}</span>
        <ChevronDownIcon width={12} height={12} className={styles.iconTriggerChevron} />
      </button>
      {open && (
        <div className={styles.iconDropdown}>
          <button type="button"
            className={`${styles.iconOption} ${!value ? styles.iconOptionActive : ''}`}
            onClick={() => { onChange(''); setOpen(false); }}
          >
            <MinusIcon width={16} height={16} style={{ color: 'var(--color-clarity-gray-2)' }} />
            <span>Sin prioridad</span>
          </button>
          {priorities.map(p => {
            const pCfg = PRIORITY_CONFIG[p.nombre];
            return (
              <button key={p.id} type="button"
                className={`${styles.iconOption} ${String(p.id) === value ? styles.iconOptionActive : ''}`}
                onClick={() => { onChange(String(p.id)); setOpen(false); }}
              >
                <span style={{ color: pCfg?.color }}>{pCfg?.icon}</span>
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
interface EditBacklogItemFormProps {
  item: BacklogItemRecord;
  meta: BacklogMeta;
  onClose: () => void;
  onUpdated?: () => void;
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
}

function itemToForm(item: BacklogItemRecord): FormState {
  return {
    nombre:            item.nombre,
    descripcion:       item.descripcion ?? '',
    id_tipo:           item.id_tipo      != null ? String(item.id_tipo)      : '',
    id_estatus:        String(item.id_estatus),
    id_prioridad:      item.id_prioridad != null ? String(item.id_prioridad) : '',
    id_sprint:         item.id_sprint    != null ? String(item.id_sprint)    : '',
    fecha_inicio:      item.fecha_inicio      ?? '',
    fecha_vencimiento: item.fecha_vencimiento ?? '',
  };
}

const EditBacklogItemForm: React.FC<EditBacklogItemFormProps> = ({ item, meta, onClose, onUpdated }) => {
  const [form, setForm] = useState<FormState>(() => itemToForm(item));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-sync form if item changes
  useEffect(() => { setForm(itemToForm(item)); }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.id_estatus) return;
    setSubmitting(true);
    setError(null);
    const payload: UpdateBacklogItemPayload = {
      nombre:            form.nombre.trim(),
      descripcion:       form.descripcion || null,
      id_tipo:           form.id_tipo      ? Number(form.id_tipo)      : null,
      id_estatus:        Number(form.id_estatus),
      id_prioridad:      form.id_prioridad ? Number(form.id_prioridad) : null,
      id_sprint:         form.id_sprint    ? Number(form.id_sprint)    : null,
      fecha_inicio:      form.fecha_inicio      || null,
      fecha_vencimiento: form.fecha_vencimiento || null,
    };
    try {
      await updateBacklogItem(item.id, payload);
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormPopUp
      eyebrow="Backlog"
      title="Editar ítem"
      subtitle="Modifica los campos que necesites y guarda los cambios."
      isOpen
      onClose={onClose}
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        {/* Nombre */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-nombre">
            Nombre <span className={styles.required}>*</span>
          </label>
          <input id="edit-nombre" name="nombre" className={styles.input} type="text"
            placeholder="Nombre del ítem" value={form.nombre} onChange={handleChange} required />
        </div>

        {/* Descripción */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="edit-descripcion">Descripción</label>
          <textarea id="edit-descripcion" name="descripcion" className={styles.textarea}
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
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </FormPopUp>
  );
};

export default EditBacklogItemForm;
