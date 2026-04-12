-- zona_horaria
INSERT INTO public.zona_horaria (id, nombre) VALUES (1, 'America/Mexico_City');

-- rol_global
INSERT INTO public.rol_global (id, nombre, descripcion) VALUES (1, 'admin', 'Administrador');

-- usuario
INSERT INTO public.usuario (
  email,
  telefono,
  nombre,
  apellido,
  fecha_nacimiento,
  sobre_mi,
  fecha_creacion,
  jornada,
  id_creador,
  id_zona_horaria,
  id_rol_global
) VALUES (
  'juan.guarnizo@jixology.com',
  '+521234567890',
  'Juan',
  'Guarnizo',
  '1990-01-01',
  'Usuario administrador inicial del sistema.',
  NOW(),
  8,
  NULL,
  1,
  1
);

-- usuario_inventario_avatar (subset of elements owned by user id=1)
INSERT INTO public.usuario_inventario_avatar (id_usuario, id_elemento, fecha_obtencion) VALUES
  -- accessories (atributo 1): 2 variants + 2 colors
  (1, 1,   NOW()),  -- accessories variant01
  (1, 2,   NOW()),  -- accessories variant02
  (1, 5,   NOW()),  -- accessoriesColor a9a9a9
  (1, 6,   NOW()),  -- accessoriesColor d3d3d3
  -- beard (atributo 3): 2 variants
  (1, 11,  NOW()),  -- beard variant01
  (1, 12,  NOW()),  -- beard variant02
  -- clothing (atributo 4): 3 variants + 3 colors
  (1, 19,  NOW()),  -- clothing variant01
  (1, 23,  NOW()),  -- clothing variant05
  (1, 40,  NOW()),  -- clothing variant22
  (1, 44,  NOW()),  -- clothingColor 428bca
  (1, 49,  NOW()),  -- clothingColor d11141
  (1, 51,  NOW()),  -- clothingColor ffc425
  -- eyes (atributo 6): 3 variants + 2 colors
  (1, 55,  NOW()),  -- eyes variant01
  (1, 57,  NOW()),  -- eyes variant03
  (1, 60,  NOW()),  -- eyes variant06
  (1, 67,  NOW()),  -- eyesColor 588387
  (1, 72,  NOW()),  -- eyesColor 876658
  -- glasses (atributo 8): 2 variants + 1 color
  (1, 74,  NOW()),  -- glasses dark01
  (1, 81,  NOW()),  -- glasses light01
  (1, 88,  NOW()),  -- glassesColor 191919
  -- hair (atributo 10): 4 variants + 3 colors
  (1, 95,  NOW()),  -- hair long01
  (1, 99,  NOW()),  -- hair long05
  (1, 116, NOW()),  -- hair short01
  (1, 125, NOW()),  -- hair short10
  (1, 141, NOW()),  -- hairColor 28150a
  (1, 142, NOW()),  -- hairColor 603015
  (1, 150, NOW()),  -- hairColor cab188
  -- hat (atributo 12): 2 variants + 2 colors
  (1, 153, NOW()),  -- hat variant02
  (1, 156, NOW()),  -- hat variant05
  (1, 162, NOW()),  -- hatColor 2663a3
  (1, 164, NOW()),  -- hatColor 3d8a6b
  -- mouth (atributo 14): 3 variants + 2 colors
  (1, 170, NOW()),  -- mouth happy01
  (1, 172, NOW()),  -- mouth happy03
  (1, 183, NOW()),  -- mouth sad01
  (1, 193, NOW()),  -- mouthColor c98276
  (1, 195, NOW()),  -- mouthColor de0f0d
  -- backgroundColor (atributo 16): 3 colors + both types
  (1, 198, NOW()),  -- backgroundColor b6e3f4
  (1, 199, NOW()),  -- backgroundColor c0aede
  (1, 201, NOW()),  -- backgroundColor ffd5dc
  (1, 204, NOW()),  -- backgroundType solid
  (1, 205, NOW()),  -- backgroundType gradientLinear
  -- skinColor (atributo 18): 3 colors
  (1, 210, NOW()),  -- skinColor e0b687
  (1, 212, NOW()),  -- skinColor f5cfa0
  (1, 213, NOW());  -- skinColor ffdbac

-- usuario_avatar (active equipped avatar for user id=1)
-- Absent features (accessories, beard, glasses, hat) default to probability=0 (hidden)
INSERT INTO public.usuario_avatar (id_usuario, id_elemento) VALUES
  (1, 40),   -- clothing: variant22
  (1, 44),   -- clothingColor: 428bca
  (1, 57),   -- eyes: variant03
  (1, 67),   -- eyesColor: 588387
  (1, 99),   -- hair: long05
  (1, 141),  -- hairColor: 28150a
  (1, 172),  -- mouth: happy03
  (1, 193),  -- mouthColor: c98276
  (1, 198),  -- backgroundColor: b6e3f4
  (1, 204),  -- backgroundType: solid
  (1, 212);  -- skinColor: f5cfa0




-- 


-- usuario #2
INSERT INTO public.usuario (
  email,
  telefono,
  nombre,
  apellido,
  fecha_nacimiento,
  sobre_mi,
  fecha_creacion,
  jornada,
  id_creador,
  id_zona_horaria,
  id_rol_global
) VALUES (
  'sofia.ramirez@jixology.com',
  '+521987654321',
  'Sofia',
  'Ramirez',
  '1995-06-15',
  'Desarrolladora frontend apasionada por el diseño y la experiencia de usuario.',
  NOW(),
  8,
  NULL,
  1,
  1
);

-- usuario_inventario_avatar (subset of elements owned by user id=2)
INSERT INTO public.usuario_inventario_avatar (id_usuario, id_elemento, fecha_obtencion) VALUES
  -- accessories (atributo 1): 2 variants + 2 colors
  (2, 3,   NOW()),  -- accessories variant03
  (2, 4,   NOW()),  -- accessories variant04
  (2, 7,   NOW()),  -- accessoriesColor daa520
  (2, 9,   NOW()),  -- accessoriesColor ffd700
  -- beard (atributo 3): 2 variants
  (2, 13,  NOW()),  -- beard variant03
  (2, 15,  NOW()),  -- beard variant05
  -- clothing (atributo 4): 3 variants + 3 colors
  (2, 21,  NOW()),  -- clothing variant03
  (2, 28,  NOW()),  -- clothing variant10
  (2, 33,  NOW()),  -- clothing variant15
  (2, 43,  NOW()),  -- clothingColor 03396c
  (2, 47,  NOW()),  -- clothingColor 88d8b0
  (2, 50,  NOW()),  -- clothingColor ff6f69
  -- eyes (atributo 6): 3 variants + 2 colors
  (2, 58,  NOW()),  -- eyes variant04
  (2, 62,  NOW()),  -- eyes variant08
  (2, 64,  NOW()),  -- eyes variant10
  (2, 68,  NOW()),  -- eyesColor 5b7c8b
  (2, 69,  NOW()),  -- eyesColor 647b90
  -- glasses (atributo 8): 2 variants + 1 color
  (2, 76,  NOW()),  -- glasses dark03
  (2, 83,  NOW()),  -- glasses light03
  (2, 90,  NOW()),  -- glassesColor 43677d
  -- hair (atributo 10): 4 variants + 3 colors
  (2, 97,  NOW()),  -- hair long03
  (2, 104, NOW()),  -- hair long10
  (2, 120, NOW()),  -- hair short05
  (2, 130, NOW()),  -- hair short15
  (2, 140, NOW()),  -- hairColor 009bbd
  (2, 146, NOW()),  -- hairColor 83623b
  (2, 148, NOW()),  -- hairColor a78961
  -- hat (atributo 12): 2 variants + 2 colors
  (2, 154, NOW()),  -- hat variant03
  (2, 158, NOW()),  -- hat variant07
  (2, 165, NOW()),  -- hatColor 614f8a
  (2, 168, NOW()),  -- hatColor cc6192
  -- mouth (atributo 14): 3 variants + 2 colors
  (2, 174, NOW()),  -- mouth happy05
  (2, 179, NOW()),  -- mouth happy10
  (2, 185, NOW()),  -- mouth sad03
  (2, 194, NOW()),  -- mouthColor d29985
  (2, 196, NOW()),  -- mouthColor e35d6a
  -- backgroundColor (atributo 16): 3 colors + both types
  (2, 199, NOW()),  -- backgroundColor c0aede
  (2, 200, NOW()),  -- backgroundColor d1d4f9
  (2, 202, NOW()),  -- backgroundColor ffdfbf
  (2, 204, NOW()),  -- backgroundType solid
  (2, 205, NOW()),  -- backgroundType gradientLinear
  -- skinColor (atributo 18): 3 colors
  (2, 206, NOW()),  -- skinColor 8d5524
  (2, 207, NOW()),  -- skinColor a26d3d
  (2, 209, NOW());  -- skinColor cb9e6e

-- usuario_avatar (active equipped avatar for user id=2)
-- Absent features (accessories, beard, glasses, hat) default to probability=0 (hidden)
INSERT INTO public.usuario_avatar (id_usuario, id_elemento) VALUES
  (2, 28),   -- clothing: variant10
  (2, 43),   -- clothingColor: 03396c
  (2, 58),   -- eyes: variant04
  (2, 68),   -- eyesColor: 5b7c8b
  (2, 104),  -- hair: long10
  (2, 140),  -- hairColor: 009bbd
  (2, 174),  -- mouth: happy05
  (2, 194),  -- mouthColor: d29985
  (2, 200),  -- backgroundColor: d1d4f9
  (2, 204),  -- backgroundType: solid
  (2, 207);  -- skinColor: a26d3d
