import { supabase } from '@/core/supabase/supabase.client';
import type {
  CreateProjectPayload,
  CreateProjectResponse,
  ProjectCatalogs,
  ProjectCatalogOption,
  ProjectCurrencyOption,
  ProjectStatusOption,
} from '@/features/project/projectHub/types/create.project.types';

function mapCatalogOption(row: { id: number; nombre: string }): ProjectCatalogOption {
  return {
    id: row.id,
    nombre: row.nombre,
  };
}

function mapCurrencyOption(row: {
  id: number;
  nombre: string;
  abreviatura: string;
}): ProjectCurrencyOption {
  return {
    id: row.id,
    nombre: row.nombre,
    abreviatura: row.abreviatura,
  };
}

function mapStatusOption(row: {
  id: number;
  nombre: string;
  orden: number;
  es_terminal: boolean;
}): ProjectStatusOption {
  return {
    id: row.id,
    nombre: row.nombre,
    orden: row.orden,
    es_terminal: row.es_terminal,
  };
}

export async function getCreateProjectCatalogs(): Promise<ProjectCatalogs> {
  const [
    divisaResult,
    metodologiaResult,
    estatusResult,
    tipoResult,
    modeloFacturacionResult,
    complejidadResult,
  ] = await Promise.all([
    supabase.from('divisa').select('id, nombre, abreviatura').order('id'),
    supabase.from('metodologia_proyecto').select('id, nombre').order('id'),
    supabase.from('estatus_proyecto').select('id, nombre, orden, es_terminal').order('orden'),
    supabase.from('tipo_proyecto').select('id, nombre').order('id'),
    supabase.from('modelo_facturacion').select('id, nombre').order('id'),
    supabase.from('complejidad_proyecto').select('id, nombre').order('id'),
  ]);

  if (divisaResult.error) throw new Error(divisaResult.error.message);
  if (metodologiaResult.error) throw new Error(metodologiaResult.error.message);
  if (estatusResult.error) throw new Error(estatusResult.error.message);
  if (tipoResult.error) throw new Error(tipoResult.error.message);
  if (modeloFacturacionResult.error) throw new Error(modeloFacturacionResult.error.message);
  if (complejidadResult.error) throw new Error(complejidadResult.error.message);

  return {
    divisa: (divisaResult.data ?? []).map(mapCurrencyOption),
    metodologia_proyecto: (metodologiaResult.data ?? []).map(mapCatalogOption),
    estatus_proyecto: (estatusResult.data ?? []).map(mapStatusOption),
    tipo_proyecto: (tipoResult.data ?? []).map(mapCatalogOption),
    modelo_facturacion: (modeloFacturacionResult.data ?? []).map(mapCatalogOption),
    complejidad_proyecto: (complejidadResult.data ?? []).map(mapCatalogOption),
  };
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<CreateProjectResponse> {
  const { data, error } = await supabase
    .from('proyecto')
    .insert({
      nombre: payload.nombre,
      descripcion: payload.descripcion,
      cliente: payload.cliente,
      fecha_inicial: payload.fecha_inicial,
      fecha_final: payload.fecha_final,
      dependencia_externa: payload.dependencia_externa,
      hitos_estimados: payload.hitos_estimados,
      presupuesto: payload.presupuesto,
      costo_mensual: payload.costo_mensual,
      tolerancia_desviacion: payload.tolerancia_desviacion,
      peso_presupuesto: payload.peso_presupuesto,
      peso_retraso: payload.peso_retraso,
      id_divisa_presupuesto: payload.id_divisa_presupuesto,
      id_divisa_costo: payload.id_divisa_costo,
      id_modelo_facturacion: payload.id_modelo_facturacion,
      id_complejidad: payload.id_complejidad,
      id_tipo: payload.id_tipo,
      id_estatus: payload.id_estatus,
      id_metodologia: payload.id_metodologia,
      id_creador: payload.id_creador,
      stack_tecnologico: payload.stack_tecnologico,
    })
    .select('id, nombre')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    message: `Proyecto "${data.nombre}" creado correctamente.`,
  };
}