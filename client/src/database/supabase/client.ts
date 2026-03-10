import { createClient } from '@supabase/supabase-js';

// Vite usa import.meta.env en lugar de process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno para Supabase en el Frontend');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);