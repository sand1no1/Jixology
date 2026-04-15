import { useEffect, useState } from 'react';

// --- Servicios ---
import { getProjects } from '../services/projects.services';

// --- Tipos ---
import type { Project } from '../types/Project';

export function useProjectCards(globalRole: number, userId: number) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const MIN_LOADING_MS = 1500;
    const start = Date.now();

    getProjects(globalRole, userId)
      .then(setProjects)
      .catch((err: Error) => setError(err.message))
      .finally(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        setTimeout(() => setLoading(false), remaining);
      });
  }, [globalRole, userId]);

  return { projects, loading, error };
}
