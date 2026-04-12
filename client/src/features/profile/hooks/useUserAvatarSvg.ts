import { useEffect, useMemo, useState } from 'react';

import { fetchUserActiveAvatar, makeAvatarSvg } from '../services/avatar.service';
import { useAvatarCatalog } from './useAvatarCatalog';
import type { DynamicFeatures } from '../types/avatar.types';

/**
 * Loads the active avatar for a given user from the DB and returns a ready SVG string.
 * Falls back to catalog default features if the user has no saved avatar.
 */
export function useUserAvatarSvg(userId: number) {
  const { catalog, allElements, atributos, loading: loadingCatalog } = useAvatarCatalog();
  const [features, setFeatures] = useState<DynamicFeatures | null>(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);

  useEffect(() => {
    if (!catalog || allElements.length === 0 || atributos.length === 0) return;

    setLoadingAvatar(true);
    fetchUserActiveAvatar(userId, allElements, atributos)
      .then(active => setFeatures(active ?? catalog.defaultFeatures))
      .catch(() => setFeatures(catalog.defaultFeatures))
      .finally(() => setLoadingAvatar(false));
  }, [userId, catalog, allElements, atributos]);

  const avatarSvg = useMemo(
    () => (features ? makeAvatarSvg(features) : ''),
    [features],
  );

  return { avatarSvg, loading: loadingCatalog || loadingAvatar };
}
