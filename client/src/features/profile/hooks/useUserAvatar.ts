import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  fetchUserInventory,
  fetchUserActiveAvatar,
  saveUserActiveAvatar,
  filterCatalogByInventory,
  addElementToInventory,
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
  addRandomItem:    () => Promise<ElementoInventarioAvatar | null>;
  unownedItems:     ElementoInventarioAvatar[];
  saving:           boolean;
  loadingAvatar:    boolean;
  addingItem:       boolean;
}

export function useUserAvatar(
  userId:      number,
  catalog:     AvatarCatalog | null,
  allElements: ElementoInventarioAvatar[],
  atributos:   AtributoAvatar[],
): UseUserAvatarResult {
  const [filteredCatalog, setFilteredCatalog] = useState<AvatarCatalog | null>(null);
  const [initialFeatures, setInitialFeatures] = useState<DynamicFeatures>({});
  const [ownedIds,        setOwnedIds]        = useState<Set<number>>(new Set());
  const [loadingAvatar,   setLoadingAvatar]   = useState(false);
  const [saving,          setSaving]          = useState(false);
  const [addingItem,      setAddingItem]      = useState(false);

  useEffect(() => {
    if (!catalog || allElements.length === 0 || atributos.length === 0) return;

    setLoadingAvatar(true);

    Promise.all([
      fetchUserInventory(userId),
      fetchUserActiveAvatar(userId, allElements, atributos),
    ])
      .then(([ids, activeFeatures]) => {
        setOwnedIds(ids);
        const narrowed = filterCatalogByInventory(catalog, ids, allElements, atributos);
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

  const addRandomItem = useCallback(async (): Promise<ElementoInventarioAvatar | null> => {
    const unowned = allElements.filter(e => !ownedIds.has(e.id));
    if (unowned.length === 0) return null;
    const picked = unowned[Math.floor(Math.random() * unowned.length)];
    setAddingItem(true);
    try {
      await addElementToInventory(userId, picked.id);
      const newOwnedIds = new Set([...ownedIds, picked.id]);
      setOwnedIds(newOwnedIds);
      if (catalog) {
        setFilteredCatalog(filterCatalogByInventory(catalog, newOwnedIds, allElements, atributos));
      }
      return picked;
    } finally {
      setAddingItem(false);
    }
  }, [userId, allElements, ownedIds, catalog, atributos]);

  const unownedItems = useMemo(
    () => allElements.filter(e => !ownedIds.has(e.id)),
    [allElements, ownedIds],
  );

  return { filteredCatalog, initialFeatures, saveAvatar, addRandomItem, unownedItems, saving, loadingAvatar, addingItem };
}
