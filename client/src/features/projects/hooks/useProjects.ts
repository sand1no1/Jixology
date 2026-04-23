import { useEffect, useState } from 'react';

// --- Servicios ---
import { getProjects } from '../services/projects.services';

// --- Tipos ---
import type { Project } from '../types/Project';

export function useProjectCards(
  globalRole: number | null | undefined,
  userId: number | null | undefined,
  userLoading: boolean,
) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (userLoading || globalRole == null || userId == null) return;

    getProjects(globalRole, userId)
      .then(setProjects)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [globalRole, userId, userLoading]);

  return { projects, setProjects, loading, error };
}
