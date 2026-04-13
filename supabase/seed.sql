-- ============================================================
-- SEED: Datos de prueba para desarrollo local
-- ============================================================

-- --- Catálogos base (requeridos por FKs) ---

INSERT INTO zona_horaria (id, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'America/Mexico_City');

INSERT INTO rol_global (id, nombre, descripcion) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Admin',   'Acceso total'),
  (2, 'Manager', 'Acceso como manager'),
  (3, 'Member',  'Acceso por membresía');

INSERT INTO estatus_proyecto (id, nombre, orden, es_terminal) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Completado',   4, true),
  (2, 'En Progreso',  2, false),
  (3, 'Retrasado',    3, false),
  (4, 'Sin Asignar',  1, false);

INSERT INTO metodologia_proyecto (id, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Scrum'),
  (2, 'Kanban'),
  (3, 'Waterfall');

-- --- Usuarios de prueba ---

INSERT INTO usuario (id, email, nombre, apellido, fecha_creacion, id_zona_horaria, id_rol_global)
OVERRIDING SYSTEM VALUE VALUES
  (101, 'admin@jixology.dev',  'Admin',  'Test', NOW(), 1, 1),
  (201, 'member@jixology.dev', 'Member', 'Test', NOW(), 1, 3);

-- --- Proyectos (4 proyectos, creados por el admin) ---

INSERT INTO proyecto (id, nombre, descripcion, cliente, fecha_inicial, fecha_final, fecha_creacion, id_estatus, id_metodologia, id_creador, stack_tecnologico)
OVERRIDING SYSTEM VALUE VALUES
  (1, 'Proyecto Alpha',
      'Migración completa del sistema legacy a arquitectura moderna.',
      'Mahindra', '2025-09-01', '2026-06-01', NOW(), 1, 1, 101,
      ARRAY['React', 'Supabase', 'TypeScript']),

  (2, 'Proyecto Beta',
      'Módulo de reportes financieros con exportación a PDF y Excel.',
      'Cliente B', '2025-11-01', '2026-08-15', NOW(), 2, 2, 101,
      ARRAY['Vue', 'Node.js', 'PostgreSQL']),

  (3, 'Proyecto Gamma',
      'Integración con API de pagos externos. Bloqueado por proveedor.',
      'Cliente C', '2025-12-01', '2026-05-10', NOW(), 3, 1, 101,
      ARRAY['React', 'Stripe', 'Express']),

  (4, 'Proyecto Delta',
      'App móvil para gestión de inventario en campo.',
      'Cliente D', '2026-03-01', '2026-09-01', NOW(), 4, 3, 101,
      ARRAY['React Native', 'Supabase']);

-- --- Membresías ---
-- Usuario 101 (admin, globalRole=1): ve todo por su rol, pero también tiene membresía
-- Usuario 201 (member, globalRole=3): solo tiene acceso al Proyecto Beta

INSERT INTO usuario_proyecto (id_usuario, id_proyecto) VALUES
  (101, 1),
  (101, 2),
  (101, 3),
  (101, 4),
  (201, 2);
