BEGIN;

ALTER TABLE public.usuario
ADD COLUMN auth_id uuid NOT NULL UNIQUE
REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.usuario
ALTER COLUMN fecha_creacion SET DEFAULT now();

COMMIT;