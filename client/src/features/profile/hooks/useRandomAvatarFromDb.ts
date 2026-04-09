import { useEffect, useMemo, useState } from 'react';
import { CATALOG, makeAvatarSvg } from '../services/avatar.service';
import type { DynamicFeatures } from '../types/avatar.types';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Build random DynamicFeatures from the static catalog (synchronous fallback). */
export function buildRandomFeatures(): DynamicFeatures {
  const features: DynamicFeatures = {};

  for (const meta of CATALOG.features) {
    if (meta.colorOnly) {
      const validColors = meta.colorOptions.filter(c => c !== 'transparent');
      if (validColors.length > 0) features[meta.colorProp!] = [pickRandom(validColors)];
      if (meta.typeProp && meta.typeOptions.length > 0) {
        features[meta.typeProp] = [pickRandom(meta.typeOptions)];
      }
    } else {
      if (meta.variants.length > 0) features[meta.key] = [pickRandom(meta.variants)];
      if (meta.colorProp) {
        const validColors = meta.colorOptions.filter(c => c !== 'transparent');
        if (validColors.length > 0) features[meta.colorProp] = [pickRandom(validColors)];
      }
      if (meta.probProp) features[meta.probProp] = Math.random() < 0.4 ? 100 : 0;
    }
  }

  return features;
}

/**
 * Fetches elemento_inventario_avatar from Supabase and returns random
 * DynamicFeatures to use as the initial avatar state.
 * Falls back to the static catalog if the DB is unavailable.
 */
export function useRandomAvatarFromDb() {
  const [initialFeatures, setInitialFeatures] = useState<DynamicFeatures>(
    () => buildRandomFeatures()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAndBuild() {
      try {
        const { supabase } = await import('../../../core/supabase/supabase.client');

        const { data, error: dbError } = await supabase
          .from('elemento_inventario_avatar')
          .select('nombre, atributo_avatar(nombre)');

        if (dbError || !data || data.length === 0) {
          console.warn('[useRandomAvatarFromDb] DB unavailable, using static catalog.', dbError?.message);
          return;
        }

        // Group element names by attribute name
        const byAttr = new Map<string, string[]>();
        for (const row of data) {
          const attrNombre = (row.atributo_avatar as unknown as { nombre: string } | null)?.nombre;
          if (!attrNombre) continue;
          if (!byAttr.has(attrNombre)) byAttr.set(attrNombre, []);
          byAttr.get(attrNombre)!.push(row.nombre);
        }

        const features: DynamicFeatures = {};

        for (const meta of CATALOG.features) {
          if (meta.colorOnly) {
            const colors = byAttr.get(meta.colorProp!) ?? [];
            const validColors = colors.filter(c => c !== 'transparent');
            if (validColors.length > 0) features[meta.colorProp!] = [pickRandom(validColors)];
            if (meta.typeProp) {
              const types = byAttr.get(meta.typeProp) ?? [];
              if (types.length > 0) features[meta.typeProp] = [pickRandom(types)];
            }
          } else {
            const variants = byAttr.get(meta.key) ?? [];
            if (variants.length > 0) features[meta.key] = [pickRandom(variants)];
            if (meta.colorProp) {
              const colors = byAttr.get(meta.colorProp) ?? [];
              const validColors = colors.filter(c => c !== 'transparent');
              if (validColors.length > 0) features[meta.colorProp] = [pickRandom(validColors)];
            }
            if (meta.probProp) features[meta.probProp] = Math.random() < 0.4 ? 100 : 0;
          }
        }

        setInitialFeatures(features);
      } catch (err) {
        console.warn('[useRandomAvatarFromDb] Unexpected error, using static catalog.', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAndBuild();
  }, []);

  return { initialFeatures, loading };
}

/** Thin wrapper — returns a ready-to-use SVG string for components that don't need inventory controls. */
export function useRandomAvatarSvg() {
  const { initialFeatures, loading } = useRandomAvatarFromDb();
  const avatarSvg = useMemo(() => makeAvatarSvg(initialFeatures), [initialFeatures]);
  return { avatarSvg, loading };
}
