import type { CreateProjectPayload, CreateProjectResponse, ProjectCatalogs } from '@/features/projects/types/create.project.types';

const MOCK_CATALOGS: ProjectCatalogs = {
  divisa: [
    { id: 1, nombre: 'Peso mexicano', abreviatura: 'MXN' },
    { id: 2, nombre: 'Dólar estadounidense', abreviatura: 'USD' },
  ],
  metodologia_proyecto: [
    { id: 1, nombre: 'Scrum' },
    { id: 2, nombre: 'Kanban' },
    { id: 3, nombre: 'Cascada' },
    { id: 4, nombre: 'Híbrida' },
  ],
  estatus_proyecto: [
    { id: 1, nombre: 'Completado', orden: 1, es_terminal: true },
    { id: 2, nombre: 'En progreso', orden: 2, es_terminal: false },
    { id: 3, nombre: 'Retrasado', orden: 3, es_terminal: false },
    { id: 4, nombre: 'Sin asignar', orden: 4, es_terminal: false },
  ],
  tipo_proyecto: [
    { id: 1, nombre: 'Desarrollo' },
    { id: 2, nombre: 'Implementación' },
    { id: 3, nombre: 'Mantenimiento' },
    { id: 4, nombre: 'Consultoría' },
  ],
  modelo_facturacion: [
    { id: 1, nombre: 'Precio fijo' },
    { id: 2, nombre: 'Tiempo y materiales' },
    { id: 3, nombre: 'Bolsa de horas' },
  ],
  complejidad_proyecto: [
    { id: 1, nombre: 'Baja' },
    { id: 2, nombre: 'Media' },
    { id: 3, nombre: 'Alta' },
  ],
};

let nextMockId = 1000;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getCreateProjectCatalogs(): Promise<ProjectCatalogs> {
  await delay(500);

  return {
    divisa: MOCK_CATALOGS.divisa.map((item) => ({ ...item })),
    metodologia_proyecto: MOCK_CATALOGS.metodologia_proyecto.map((item) => ({ ...item })),
    estatus_proyecto: MOCK_CATALOGS.estatus_proyecto.map((item) => ({ ...item })),
    tipo_proyecto: MOCK_CATALOGS.tipo_proyecto.map((item) => ({ ...item })),
    modelo_facturacion: MOCK_CATALOGS.modelo_facturacion.map((item) => ({ ...item })),
    complejidad_proyecto: MOCK_CATALOGS.complejidad_proyecto.map((item) => ({ ...item })),
  };
}

export async function createProjectMock(payload: CreateProjectPayload,): Promise<CreateProjectResponse> {
  await delay(900);

  if (payload.nombre.trim().toLowerCase() === 'error-demo') {
    throw new Error('No fue posible crear el proyecto. Intenta nuevamente.');
  }

  return {
    id: nextMockId++,
    message: `Proyecto "${payload.nombre}" creado correctamente.`,
  };
}