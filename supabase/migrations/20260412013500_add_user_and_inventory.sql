INSERT INTO zona_horaria (id, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'America/Mexico_City');

INSERT INTO rol_global (id, nombre, descripcion) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Admin',   'Acceso total'),
  (2, 'Manager', 'Acceso como manager'),
  (3, 'Member',  'Acceso por membresía');