import { supabase } from '@/core/supabase/supabase.client';
import type { BacklogItemRecord, SprintRecord } from '@/features/project/Backlog/types/backlog.types';

export async function fetchUserAssignedItems(userId: number): Promise<BacklogItemRecord[]> {
  const { data, error } = await supabase
    .from('backlog_item')
    .select('*')
    .eq('id_usuario_responsable', userId)
    .order('fecha_creacion', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function fetchAllSprints(): Promise<SprintRecord[]> {
  const { data, error } = await supabase
    .from('sprint')
    .select('id, nombre, objetivo, fecha_inicio, fecha_final, id_proyecto, id_usuario_creador, id_estatus')
    .order('fecha_inicio', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}
