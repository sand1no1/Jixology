import { supabase } from '../../../core/supabase/supabase.client';

export interface Usuario {
  id: number;
  nombre: string | null;
  apellido: string | null;
  email: string;
  telefono: string | null;
  fecha_nacimiento: string | null;
  sobre_mi: string | null;
}

export async function fetchUsuario(userId: number): Promise<Usuario> {
  const { data, error } = await supabase
    .from('usuario')
    .select('id, nombre, apellido, email, telefono, fecha_nacimiento, sobre_mi')
    .eq('id', userId)
    .single();

  if (error) throw new Error(error.message);
  return data as Usuario;
}
