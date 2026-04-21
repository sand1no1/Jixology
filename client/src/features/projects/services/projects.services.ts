import { supabase } from '@/core/supabase/supabase.client';

// --- Tipos ---
import type { Project } from '../types/Project';

// Interfaz para contexto de Projctos.
export type ProjectContextData = Pick<Project,
  | 'id'
  | 'nombre'
  | 'cliente'
  | 'id_estatus'
> & {
  metodologia: string;
};

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

export async function fetchProjectContext(projectId: number): Promise<ProjectContextData> {
  const { data, error } = await supabase
                                  .from('proyecto')
                                  .select('id, nombre, cliente, id_estatus, metodologia_proyecto!inner(nombre)')
                                  .eq('id', projectId)
                                  .single();
  if (error) throw new Error(error.message);

  return {
    id: data.id,
    nombre: data.nombre,
    cliente: data.cliente,
    id_estatus: data.id_estatus,
    metodologia: Array.isArray(data.metodologia_proyecto)
    ? data.metodologia_proyecto[0].nombre
    : (data.metodologia_proyecto as {nombre : string }).nombre,
  };
}

export async function isUserProjectAccess(idUsuario: number, idProjecto: number): Promise<boolean> {


}
