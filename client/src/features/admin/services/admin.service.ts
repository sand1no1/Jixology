import {
  FunctionsFetchError,
  FunctionsHttpError,
  FunctionsRelayError,
} from '@supabase/supabase-js';
import { supabase } from '@/core/supabase/supabase.client';
import type {
  RegisterUserPayload,
  RegisterUserResponse,
} from '../types/admin.types';

export async function registerUserService(
  payload: RegisterUserPayload
): Promise<RegisterUserResponse> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const options: {
    body: RegisterUserPayload;
    headers?: Record<string, string>;
  } = {
    body: payload,
  };

  if (session?.access_token) {
    options.headers = {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  const { data, error } = await supabase.functions.invoke('register_user', options);

  if (error) {
    if (error instanceof FunctionsHttpError) {
      let errorBody: any = null;

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

    throw new Error(error.message || 'No se pudo registrar el usuario.');
  }

  if (!data) {
    throw new Error('La Edge Function no devolvió datos.');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as RegisterUserResponse;
}