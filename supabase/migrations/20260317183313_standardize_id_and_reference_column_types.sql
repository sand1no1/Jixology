-- id_proyecto de backlog_item_proyecto
ALTER TABLE public.backlog_item_proyecto
DROP CONSTRAINT id_proyecto_fkey;

ALTER TABLE public.backlog_item_proyecto
ALTER COLUMN id_proyecto TYPE INT
USING id_proyecto::INT;

ALTER TABLE public.backlog_item_proyecto
ADD CONSTRAINT id_proyecto_fkey
FOREIGN KEY (id_proyecto)
REFERENCES proyecto(id);


-- id_proyecto de bitacora_proyecto
ALTER TABLE public.bitacora_proyecto
DROP CONSTRAINT id_proyecto_fkey;

ALTER TABLE public.bitacora_proyecto
ALTER COLUMN id_proyecto TYPE INT
USING id_proyecto::INT;

ALTER TABLE public.bitacora_proyecto
ADD CONSTRAINT id_proyecto_fkey
FOREIGN KEY (id_proyecto)
REFERENCES proyecto(id);


-- id_proyecto de check_in
ALTER TABLE public.check_in
DROP CONSTRAINT id_proyecto_fkey;

ALTER TABLE public.check_in
ALTER COLUMN id_proyecto TYPE INT
USING id_proyecto::INT;

ALTER TABLE public.check_in
ADD CONSTRAINT id_proyecto_fkey
FOREIGN KEY (id_proyecto)
REFERENCES proyecto(id);


-- id_etiqueta_proyecto_personalizada de etiqueta_proyecto_personalizada
ALTER TABLE public.etiqueta_proyecto_personalizada
DROP CONSTRAINT id_etiqueta_proyecto_personalizada_fkey;

ALTER TABLE public.etiqueta_proyecto_personalizada
ALTER COLUMN id_etiqueta_proyecto_personalizada TYPE BIGINT
USING id_etiqueta_proyecto_personalizada::BIGINT;

ALTER TABLE public.etiqueta_proyecto_personalizada
ADD CONSTRAINT id_etiqueta_proyecto_personalizada_fkey
FOREIGN KEY (id_etiqueta_proyecto_personalizada)
REFERENCES catalogo_etiqueta_proyecto_personalizada(id);


-- id_proyecto de hito
ALTER TABLE public.hito
DROP CONSTRAINT id_proyecto_fkey;

ALTER TABLE public.hito
ALTER COLUMN id_proyecto TYPE INT
USING id_proyecto::INT;

ALTER TABLE public.hito
ADD CONSTRAINT id_proyecto_fkey
FOREIGN KEY (id_proyecto)
REFERENCES proyecto(id);