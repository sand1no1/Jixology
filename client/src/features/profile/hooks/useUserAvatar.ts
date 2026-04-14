import { useCallback, useEffect, useState } from 'react';

import {
  fetchUserInventory,
  fetchUserActiveAvatar,
  saveUserActiveAvatar,
  filterCatalogByInventory,
} from '../services/avatar.service';
import type {
  AvatarCatalog,
  AtributoAvatar,
  DynamicFeatures,
  ElementoInventarioAvatar,
} from '../types/avatar.types';

interface UseUserAvatarResult {
  filteredCatalog:  AvatarCatalog | null;
  initialFeatures:  DynamicFeatures;
  saveAvatar:       (features: DynamicFeatures) => Promise<void>;
  saving:           boolean;
  loadingAvatar:    boolean;
}

export function useUserAvatar(
  userId:      number,
  catalog:     AvatarCatalog | null,
  allElements: ElementoInventarioAvatar[],
  atributos:   AtributoAvatar[],
): UseUserAvatarResult {
  const [filteredCatalog, setFilteredCatalog] = useState<AvatarCatalog | null>(null);
  const [initialFeatures, setInitialFeatures] = useState<DynamicFeatures>({});
  const [loadingAvatar,   setLoadingAvatar]   = useState(false);
  const [saving,          setSaving]          = useState(false);

  useEffect(() => {
    if (!catalog || allElements.length === 0 || atributos.length === 0) return;

    setLoadingAvatar(true);

    Promise.all([
      fetchUserInventory(userId),
      fetchUserActiveAvatar(userId, allElements, atributos),
    ])
      .then(([ownedIds, activeFeatures]) => {
        const narrowed = filterCatalogByInventory(catalog, ownedIds, allElements, atributos);
        setFilteredCatalog(narrowed);
        setInitialFeatures(activeFeatures ?? narrowed.defaultFeatures);
      })
      .catch(console.error)
      .finally(() => setLoadingAvatar(false));
  }, [userId, catalog, allElements, atributos]);

  const saveAvatar = useCallback(async (features: DynamicFeatures) => {
    setSaving(true);
    try {
      const styleAtributos = filteredCatalog
        ? atributos.filter(a => a.id_avatar_style === filteredCatalog.styleId)
        : atributos;
      await saveUserActiveAvatar(userId, features, allElements, styleAtributos);
    } finally {
      setSaving(false);
    }
  }, [userId, allElements, atributos, filteredCatalog]);

  return { filteredCatalog, initialFeatures, saveAvatar, saving, loadingAvatar };
}
