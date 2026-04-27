-- ── backlog_item dummy data ───────────────────────────────────────
-- 10 items, 2 per type — 2 full hierarchy chains:
--   Bug → Subtarea → Tarea → Historia de Usuario → Épica
--
-- Set A (ids 7,1,3,9,5): id_usuario_responsable = 1
-- Set B (ids 8,2,4,10,6): id_usuario_responsable = NULL
--
-- Inserted top-down (Épica first) to satisfy the self-referential FK.

BEGIN;
SET CONSTRAINTS ALL DEFERRED;

INSERT INTO backlog_item (
  id, nombre, descripcion, fecha_creacion,
  id_tipo, id_estatus, id_prioridad, id_sprint,
  id_proyecto, id_usuario_creador, id_usuario_responsable,
  id_backlog_item_padre, es_terminal
)
OVERRIDING SYSTEM VALUE VALUES

  -- ── Set A ─────────────────────────────────────────────────────
  -- Épica (id_tipo=4) — root, no parent
  (7,  'Módulo de gestión de proyectos',
       'Épica raíz que agrupa todo el módulo de proyectos.',
       NOW(), 4, 2, 2, 3, 1, 1, 1,    NULL, false),

  -- Historia de Usuario (id_tipo=1) — parent: Épica id=7
  (1,  'Como usuario quiero iniciar sesión',
       'Implementar flujo de autenticación con email y contraseña.',
       NOW(), 1, 2, 2, 1, 1, 1, 1,    7,    false),

  -- Tarea (id_tipo=2) — parent: HU id=1
  (3,  'Configurar conexión a Supabase',
       'Instalar cliente y definir variables de entorno.',
       NOW(), 2, 4, 1, 1, 1, 1, 1,    1,    false),

  -- Subtarea (id_tipo=5) — parent: Tarea id=3
  (9,  'Diseñar componente BacklogListItem',
       'Crear el componente visual para listar ítems del backlog.',
       NOW(), 5, 4, 2, 1, 1, 1, 1,    3,    false),

  -- Bug (id_tipo=3) — parent: Subtarea id=9
  (5,  'Fix: token expirado no redirige al login',
       'Al expirar la sesión el usuario ve pantalla en blanco.',
       NOW(), 3, 2, 1, 1, 1, 1, 1,    9,    false),

  -- ── Set B ─────────────────────────────────────────────────────
  -- Épica (id_tipo=4) — root, no parent
  (8,  'Módulo de backlog',
       'Épica raíz para el desarrollo completo del backlog de producto.',
       NOW(), 4, 1, 3, 3, 1, 1, NULL, NULL, false),

  -- Historia de Usuario (id_tipo=1) — parent: Épica id=8
  (2,  'Como usuario quiero ver mi perfil',
       'Mostrar datos personales y avatar del usuario autenticado.',
       NOW(), 1, 1, 3, 1, 1, 1, NULL, 8,    false),

  -- Tarea (id_tipo=2) — parent: HU id=2
  (4,  'Crear estructura de carpetas del proyecto',
       'Definir árbol de directorios siguiendo feature-based arch.',
       NOW(), 2, 1, 4, 2, 1, 1, NULL, 2,    false),

  -- Subtarea (id_tipo=5) — parent: Tarea id=4
  (10, 'Conectar hook useBacklogItems a la vista',
       'Integrar el hook con el componente de lista del backlog.',
       NOW(), 5, 3, 1, 2, 1, 1, NULL, 4,    false),

  -- Bug (id_tipo=3) — parent: Subtarea id=10
  (6,  'Fix: avatar no carga en Firefox',
       'La imagen SVG del avatar no renderiza correctamente.',
       NOW(), 3, 3, 2, 2, 1, 1, NULL, 10,   false)

ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('backlog_item', 'id'),
  (SELECT MAX(id) FROM backlog_item)
);

COMMIT;
