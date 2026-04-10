import { useMemo } from 'react';
import { makeAvatarSvg } from '../services/avatar.service';
import { useAvatarCatalog } from './useAvatarCatalog';
import type { AvatarCatalog, DynamicFeatures } from '../types/avatar.types';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Build a random DynamicFeatures from a loaded catalog. */
export function buildRandomFeatures(catalog: AvatarCatalog): DynamicFeatures {
  const features: DynamicFeatures = {};

  for (const meta of catalog.features) {
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
 * Fetches the catalog (cached after first load) and returns a random
 * DynamicFeatures + ready SVG. Used by UserCard and ListUserCard.
 */
export function useRandomAvatarSvg() {
  const { catalog, loading } = useAvatarCatalog();

  const initialFeatures = useMemo(
    () => (catalog ? buildRandomFeatures(catalog) : {}),
    [catalog],
  );

  const avatarSvg = useMemo(() => makeAvatarSvg(initialFeatures), [initialFeatures]);

  return { avatarSvg, loading };
}
