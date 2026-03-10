import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargamos las variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'FATAL ERROR: Las variables de entorno de Supabase no están definidas. ' +
    'Revisa tu archivo .env'
  );
}


export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false 
  }
});