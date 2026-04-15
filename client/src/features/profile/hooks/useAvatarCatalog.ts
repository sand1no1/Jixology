import { useEffect, useState } from 'react';
import { fetchCatalog } from '../services/avatar.service';
import type { AvatarCatalog, AtributoAvatar, ElementoInventarioAvatar } from '../types/avatar.types';

export function useAvatarCatalog(styleId = 1) {
  const [catalog,     setCatalog]     = useState<AvatarCatalog | null>(null);
  const [allElements, setAllElements] = useState<ElementoInventarioAvatar[]>([]);
  const [atributos,   setAtributos]   = useState<AtributoAvatar[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog(styleId)
      .then(({ catalog, allElements, atributos }) => {
        setCatalog(catalog);
        setAllElements(allElements);
        setAtributos(atributos);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [styleId]);

  return { catalog, allElements, atributos, loading, error };
}
