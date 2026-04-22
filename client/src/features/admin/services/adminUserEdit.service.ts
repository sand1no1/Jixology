import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js';
import { supabase } from '@/core/supabase/supabase.client';

export interface AdminEditableUser {
  id: number;
  auth_id: string;
  email: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  sobre_mi: string | null;
  jornada: number | null;
  id_zona_horaria: number | null;
  id_rol_global: number | null;
}

export interface UpdateAdminUserPayload {
  id: number;
  auth_id: string;
  email: string;
  password?: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  sobre_mi: string | null;
  jornada: number | null;
  id_zona_horaria: number | null;
  id_rol_global: number | null;
}

export async function getAdminUserById(userId: number): Promise<AdminEditableUser> {
  const { data, error } = await supabase
    .from('usuario')
    .select(
      'id, auth_id, email, nombre, apellido, telefono, fecha_nacimiento, sobre_mi, jornada, id_zona_horaria, id_rol_global'
    )
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message || 'No se pudo cargar el usuario.');
  }

  return data as AdminEditableUser;
}

export async function updateAdminUserService(
  payload: UpdateAdminUserPayload
): Promise<{ message: string }> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const options: {
    body: UpdateAdminUserPayload;
    headers?: Record<string, string>;
  } = {
    body: payload,
  };

  if (session?.access_token) {
    options.headers = {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  const { data, error } = await supabase.functions.invoke('update_admin_user', options);

  if (error) {
    if (error instanceof FunctionsHttpError) {
      let errorBody: { error?: string; message?: string } | null = null;

      try {
        errorBody = await error.context.json();
      } catch {
        throw new Error('La Edge Function devolvió un error HTTP sin cuerpo JSON.');
      }

      throw new Error(
        errorBody?.error ||
          errorBody?.message ||
          'La Edge Function devolvió un error.'
      );
    }

    if (error instanceof FunctionsRelayError) {
      throw new Error(`Relay error: ${error.message}`);
    }

    if (error instanceof FunctionsFetchError) {
      throw new Error(`Fetch error: ${error.message}`);
    }

    throw new Error(error.message || 'No se pudo actualizar el usuario.');
  }

  if (!data) {
    throw new Error('La Edge Function no devolvió datos.');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as { message: string };
}