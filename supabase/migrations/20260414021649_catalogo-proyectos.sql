INSERT INTO estatus_proyecto (id, nombre, orden, es_terminal) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Completado',   4, true),
  (2, 'En Progreso',  2, false),
  (3, 'Retrasado',    3, false),
  (4, 'Sin Asignar',  1, false);

INSERT INTO metodologia_proyecto (id, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Scrum'),
  (2, 'Kanban'),
  (3, 'Waterfall');
