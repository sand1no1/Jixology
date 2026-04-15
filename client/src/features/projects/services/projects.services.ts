import { supabase } from '@/core/supabase/supabase.client';

// --- Tipos ---
import type { Project } from '../types/Project';

export async function getProjects(globalRole: number, userId: number): Promise<Project[]> {
  if (globalRole === 1 || globalRole === 2) {
    const { data, error } = await supabase
      .from('project_card_view')
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  const { data, error } = await supabase
    .from('project_card_view')
    .select('*, usuario_proyecto!inner(id_usuario)')
    .eq('usuario_proyecto.id_usuario', userId);

  if (error) throw new Error(error.message);
  return data;
}
