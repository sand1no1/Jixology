import { supabase } from "../supabase/supabase.client";

export interface UserProfile {
    id: number;
    authId: string;
    nombre: string | null;
    apellido: string | null;
    email: string;
    idZonaHoraria: number | null;
    idRolGlobal: number | null;
    rol: string | null;
}

export async function fetchCurrentUser(authId: string): Promise<UserProfile | null> {
    const {data, error} = await supabase
        .from('usuario')
        .select('id, auth_id, nombre, apellido, email, id_zona_horaria, id_rol_global, rol_global(nombre)')
        .eq('auth_id', authId)
        .single();
    if (error) throw new Error(`${error.message}, ${error.code}`);
    if (!data) return null;

    //manejo de error de rol_global
    const rolGlobal = data.rol_global as unknown as { nombre: string } | null;
    return {
      id: data.id,
      authId: data.auth_id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      idZonaHoraria: data.id_zona_horaria,
      idRolGlobal: data.id_rol_global,
      rol: rolGlobal?.nombre ?? null,
    };
}