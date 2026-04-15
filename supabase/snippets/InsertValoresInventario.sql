INSERT INTO public.usuario_inventario_avatar (id_usuario, id_elemento, fecha_obtencion)
SELECT u.id, v.id_elemento, NOW()
FROM public.usuario u
JOIN (
  VALUES
    (1), (2), (5), (6), (11), (12),
    (19), (23), (40), (44), (49), (51),
    (55), (57), (60), (67), (72),
    (74), (81), (88),
    (95), (99), (116), (125), (141), (142), (150),
    (153), (156), (162), (164),
    (170), (172), (183), (193), (195),
    (198), (199), (201), (204), (205),
    (210), (212), (213)
) AS v(id_elemento)
ON TRUE
WHERE u.email = 'juan.guarnizo@gmail.com';
