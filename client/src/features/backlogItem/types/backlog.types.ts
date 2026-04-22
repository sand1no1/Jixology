export interface BacklogItemRecord {
  id: number;
  nombre: string;
  descripcion: string | null;
  fecha_creacion: string;
  fecha_inicio: string | null;
  fecha_vencimiento: string | null;
  es_terminal: boolean;
  id_usuario_creador: number;
  id_backlog_item_padre: number | null;
  id_usuario_responsable: number | null;
  id_prioridad: number | null;
  id_tipo: number | null;
  id_estatus: number;
  id_proyecto: number;
  id_sprint: number | null;
}

export interface BacklogStatusRecord {
  id: number;
  nombre: string;
  orden: number;
  es_terminal: boolean;
}

export interface BacklogPriorityRecord {
  id: number;
  nombre: string;
}

export interface BacklogTypeRecord {
  id: number;
  nombre: string;
}

export interface SprintRecord {
  id: number;
  nombre: string;
  objetivo: string | null;
  fecha_inicio: string | null;
  fecha_final: string | null;
  id_proyecto: number;
  id_usuario_creador: number;
  id_estatus: number;
}

export interface CreateBacklogItemPayload {
  nombre: string;
  descripcion?: string | null;
  id_tipo?: number | null;
  id_estatus: number;
  id_prioridad?: number | null;
  id_sprint?: number | null;
  id_usuario_responsable?: number | null;
  fecha_inicio?: string | null;
  fecha_vencimiento?: string | null;
  id_backlog_item_padre?: number | null;
  id_proyecto: number;
  id_usuario_creador: number;
}

export interface BacklogMeta {
  statuses:   BacklogStatusRecord[];
  priorities: BacklogPriorityRecord[];
  types:      BacklogTypeRecord[];
  sprints:    SprintRecord[];
}
