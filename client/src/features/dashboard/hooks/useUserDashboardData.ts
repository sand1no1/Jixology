import { useState, useEffect } from 'react';
import { useUser } from '@/core/auth/userContext';
import { fetchUserAssignedItems, fetchAllSprints } from '../services/dashboard.service';
import {
  fetchBacklogStatuses,
  fetchBacklogPriorities,
  fetchBacklogTypes,
} from '@/features/project/Backlog/services/backlog.service';
import type {
  BacklogItemRecord,
  BacklogStatusRecord,
  BacklogPriorityRecord,
  BacklogTypeRecord,
  SprintRecord,
} from '@/features/project/Backlog/types/backlog.types';

export interface StatusSlice   { name: string; value: number; color: string }
export interface SprintHours   { sprint: string; horas: number }
export interface TypeCount     { tipo: string; count: number }
export interface PriorityCount { prioridad: string; count: number; color: string }
export interface ScatterPoint  { x: number; y: number; nombre: string }

export interface DashboardData {
  totalItems:    number;
  statusData:    StatusSlice[];
  sprintHours:   SprintHours[];
  typeData:      TypeCount[];
  priorityData:  PriorityCount[];
  scatterData:   ScatterPoint[];
  overdueItems:  BacklogItemRecord[];
}

const STATUS_PALETTE = [
  '#0A0838', '#E31837', '#3b82f6', '#f59e0b',
  '#10b981', '#8b5cf6', '#ec4899', '#6b7280',
];

const PRIORITY_COLORS: Record<string, string> = {
  'Crítica': '#E31837',
  'Alta':    '#f97316',
  'Media':   '#6b7280',
  'Baja':    '#3b82f6',
  'Mínima':  '#1d4ed8',
};

function buildStatusData(
  items: BacklogItemRecord[],
  statuses: BacklogStatusRecord[],
): StatusSlice[] {
  const statusMap = new Map(statuses.map(s => [s.id, s.nombre]));
  const counts = new Map<number, number>();
  for (const item of items) {
    counts.set(item.id_estatus, (counts.get(item.id_estatus) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([id, value], i) => ({
    name:  statusMap.get(id) ?? `Estado ${id}`,
    value,
    color: STATUS_PALETTE[i % STATUS_PALETTE.length],
  }));
}

function buildSprintHours(
  items: BacklogItemRecord[],
  sprints: SprintRecord[],
): SprintHours[] {
  const sprintMap = new Map(sprints.map(s => [s.id, s.nombre]));
  const hours = new Map<number, number>();
  for (const item of items) {
    if (item.id_sprint == null) continue;
    hours.set(item.id_sprint, (hours.get(item.id_sprint) ?? 0) + (item.tiempo ?? 0));
  }
  return Array.from(hours.entries())
    .map(([id, horas]) => ({ sprint: sprintMap.get(id) ?? `Sprint ${id}`, horas }))
    .sort((a, b) => {
      const sa = sprints.find(s => s.nombre === a.sprint);
      const sb = sprints.find(s => s.nombre === b.sprint);
      return (sa?.fecha_inicio ?? '') < (sb?.fecha_inicio ?? '') ? -1 : 1;
    });
}

function buildTypeData(
  items: BacklogItemRecord[],
  types: BacklogTypeRecord[],
): TypeCount[] {
  const typeMap = new Map(types.map(t => [t.id, t.nombre]));
  const counts = new Map<number, number>();
  for (const item of items) {
    if (item.id_tipo == null) continue;
    counts.set(item.id_tipo, (counts.get(item.id_tipo) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([id, count]) => ({ tipo: typeMap.get(id) ?? `Tipo ${id}`, count }))
    .sort((a, b) => b.count - a.count);
}

function buildPriorityData(
  items: BacklogItemRecord[],
  priorities: BacklogPriorityRecord[],
): PriorityCount[] {
  const priorityMap = new Map(priorities.map(p => [p.id, p.nombre]));
  const counts = new Map<number, number>();
  for (const item of items) {
    if (item.id_prioridad == null) continue;
    counts.set(item.id_prioridad, (counts.get(item.id_prioridad) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([id, count]) => {
    const nombre = priorityMap.get(id) ?? `Prioridad ${id}`;
    return { prioridad: nombre, count, color: PRIORITY_COLORS[nombre] ?? '#6b7280' };
  });
}

function buildScatterData(items: BacklogItemRecord[]): ScatterPoint[] {
  return items
    .filter(item => item.complejidad != null && item.tiempo != null)
    .map(item => ({ x: item.complejidad!, y: item.tiempo!, nombre: item.nombre }));
}

function buildOverdueItems(
  items: BacklogItemRecord[],
  statuses: BacklogStatusRecord[],
): BacklogItemRecord[] {
  const terminalIds = new Set(statuses.filter(s => s.es_terminal).map(s => s.id));
  const today = new Date().toISOString().split('T')[0];
  return items.filter(
    item =>
      item.fecha_vencimiento !== null &&
      item.fecha_vencimiento < today &&
      !terminalIds.has(item.id_estatus),
  );
}

export interface UserDashboardDataResult {
  data:    DashboardData | null;
  loading: boolean;
  error:   string | null;
}

export function useUserDashboardData(): UserDashboardDataResult {
  const { user, loading: userLoading } = useUser();
  const [data, setData]     = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (userLoading || !user) return;

    let isMounted = true;

    Promise.all([
      fetchUserAssignedItems(user.id),
      fetchBacklogStatuses(),
      fetchBacklogPriorities(),
      fetchBacklogTypes(),
      fetchAllSprints(),
    ])
      .then(([items, statuses, priorities, types, sprints]) => {
        if (!isMounted) return;
        setData({
          totalItems:   items.length,
          statusData:   buildStatusData(items, statuses),
          sprintHours:  buildSprintHours(items, sprints),
          typeData:     buildTypeData(items, types),
          priorityData: buildPriorityData(items, priorities),
          scatterData:  buildScatterData(items),
          overdueItems: buildOverdueItems(items, statuses),
        });
        setError(null);
      })
      .catch((err: unknown) => {
        if (isMounted) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [user, userLoading]);

  return { data, loading, error };
}
