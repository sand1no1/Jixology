import { supabase } from '@/core/supabase/supabase.client';
import type {
  BacklogItemRecord,
  BacklogStatusRecord,
  BacklogPriorityRecord,
  BacklogTypeRecord,
  SprintRecord,
  UserRecord,
  CreateBacklogItemPayload,
  UpdateBacklogItemPayload,
} from '../types/backlog.types';

export async function fetchBacklogItems(projectId?: number): Promise<BacklogItemRecord[]> {
  let query = supabase
    .from('backlog_item')
    .select('*')
    .order('fecha_creacion', { ascending: true });

  if (projectId != null) query = query.eq('id_proyecto', projectId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchBacklogStatuses(): Promise<BacklogStatusRecord[]> {
  const { data, error } = await supabase
    .from('estatus_backlog_item')
    .select('id, nombre, orden, es_terminal')
    .order('orden', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchBacklogPriorities(): Promise<BacklogPriorityRecord[]> {
  const { data, error } = await supabase
    .from('prioridad_backlog_item')
    .select('id, nombre')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchBacklogTypes(): Promise<BacklogTypeRecord[]> {
  const { data, error } = await supabase
    .from('tipo_backlog_item')
    .select('id, nombre')
    .order('id', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchSprintsByProject(projectId: number): Promise<SprintRecord[]> {
  const { data, error } = await supabase
    .from('sprint')
    .select('id, nombre, objetivo, fecha_inicio, fecha_final, id_proyecto, id_usuario_creador, id_estatus')
    .eq('id_proyecto', projectId)
    .order('fecha_inicio', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchProjectMembers(_projectId: number): Promise<UserRecord[]> {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, apellido, email')
    .order('nombre', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createBacklogItem(payload: CreateBacklogItemPayload): Promise<BacklogItemRecord> {
  const { data, error } = await supabase
    .from('backlog_item')
    .insert({
      nombre:                payload.nombre,
      fecha_creacion:        new Date().toISOString(),
      descripcion:           payload.descripcion ?? null,
      id_tipo:               payload.id_tipo ?? null,
      id_estatus:            payload.id_estatus,
      id_prioridad:          payload.id_prioridad ?? null,
      id_sprint:             payload.id_sprint ?? null,
      id_usuario_responsable: payload.id_usuario_responsable ?? null,
      fecha_inicio:          payload.fecha_inicio ?? null,
      fecha_vencimiento:     payload.fecha_vencimiento ?? null,
      id_backlog_item_padre: payload.id_backlog_item_padre ?? null,
      id_proyecto:           payload.id_proyecto,
      id_usuario_creador:    payload.id_usuario_creador,
      es_terminal:           false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBacklogItem(id: number, payload: UpdateBacklogItemPayload): Promise<BacklogItemRecord> {
  const { data, error } = await supabase
    .from('backlog_item')
    .update({
      nombre:                 payload.nombre,
      descripcion:            payload.descripcion ?? null,
      id_tipo:                payload.id_tipo ?? null,
      id_estatus:             payload.id_estatus,
      id_prioridad:           payload.id_prioridad ?? null,
      id_sprint:              payload.id_sprint ?? null,
      fecha_inicio:           payload.fecha_inicio ?? null,
      fecha_vencimiento:      payload.fecha_vencimiento ?? null,
      id_backlog_item_padre:  payload.id_backlog_item_padre  ?? null,
      id_usuario_responsable: payload.id_usuario_responsable ?? null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
