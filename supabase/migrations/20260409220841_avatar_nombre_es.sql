-- Widen nombre columns to fit longest value (accessoriesProbability = 22 chars)
ALTER TABLE "avatar_style"               ALTER COLUMN "nombre" TYPE VARCHAR(30);
ALTER TABLE "atributo_avatar"            ALTER COLUMN "nombre" TYPE VARCHAR(30);
ALTER TABLE "elemento_inventario_avatar" ALTER COLUMN "nombre" TYPE VARCHAR(30);

-- Add Spanish display name columns
ALTER TABLE "atributo_avatar"            ADD COLUMN "nombre_es" VARCHAR(50);
ALTER TABLE "elemento_inventario_avatar" ADD COLUMN "nombre_es" VARCHAR(50);
