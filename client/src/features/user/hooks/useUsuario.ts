import { useEffect, useState } from 'react';
import { fetchUsuario } from '../services/user.service';
import type { Usuario } from '../services/user.service';

export function useUsuario(userId: number) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    fetchUsuario(userId)
      .then(setUsuario)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [userId]);

  return { usuario, loading, error };
}
