import { useEffect, useState } from 'react';
import { fetchCatalog } from '../services/avatar.service';
import type { AvatarCatalog } from '../types/avatar.types';

export function useAvatarCatalog(styleId = 1) {
  const [catalog, setCatalog] = useState<AvatarCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    fetchCatalog(styleId)
      .then(setCatalog)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [styleId]);

  return { catalog, loading, error };
}
