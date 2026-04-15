import { supabase } from '@/core/supabase/supabase.client';
import type { AdminUserListItem } from '../types/admin.types';

export async function getAdminUsers(search = ''): Promise<AdminUserListItem[]> {
  let query = supabase
    .from('usuario')
    .select('id, email, nombre, apellido, id_rol_global')
    .order('id', { ascending: false })
    .limit(10);

  const trimmedSearch = search.trim();

  if (trimmedSearch) {
    query = query.or(
      `nombre.ilike.%${trimmedSearch}%,apellido.ilike.%${trimmedSearch}%,email.ilike.%${trimmedSearch}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message || 'No se pudieron obtener los usuarios.');
  }

  return (data ?? []) as AdminUserListItem[];
}