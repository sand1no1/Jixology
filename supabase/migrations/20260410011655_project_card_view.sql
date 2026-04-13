CREATE VIEW project_card_view as 

SELECT
    p.id,
    p.nombre,
    p.id_estatus,
    p.stack_tecnologico,
    p.fecha_final,
    p.descripcion,
    p.fte,
    COUNT(b.id) AS total_backlog_items,
    COUNT(b.id) FILTER (WHERE b.id_estatus = 1) AS completed_backlog_items,
    ROUND(
      COUNT(b.id) FILTER (WHERE b.id_estatus = 1) * 100.0
      / NULLIF(COUNT(b.id), 0)
    ) AS completion_percentage
  FROM proyecto p
  LEFT JOIN backlog_item b ON b.id_proyecto = p.id
  GROUP BY p.id, p.nombre, p.id_estatus, p.stack_tecnologico, p.fecha_final,
   p.descripcion, p.fte;