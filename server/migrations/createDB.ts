import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configuración de rutas para ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones externas a Supabase/RDS
  }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('🚀 Iniciando migración...');
    
    // Ruta al archivo SQL
    const sqlPath = path.join(__dirname, 'migration001_createDB.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Ejecutando script SQL...');
    await client.query(sql);
    
    console.log('✅ Migración completada con éxito.');
  } catch (err) {
    console.error('❌ Error durante la migración:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
