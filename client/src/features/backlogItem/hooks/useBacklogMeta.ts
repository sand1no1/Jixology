import { useEffect, useState } from 'react';
import {
  fetchBacklogStatuses,
  fetchBacklogPriorities,
  fetchBacklogTypes,
  fetchSprintsByProject,
} from '../services/backlog.service';
import type { BacklogMeta } from '../types/backlog.types';

const EMPTY: BacklogMeta = { statuses: [], priorities: [], types: [], sprints: [] };

export function useBacklogMeta(projectId: number | null | undefined) {
  const [meta,    setMeta]    = useState<BacklogMeta>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (projectId == null) return;

    Promise.all([
      fetchBacklogStatuses(),
      fetchBacklogPriorities(),
      fetchBacklogTypes(),
      fetchSprintsByProject(projectId),
    ])
      .then(([statuses, priorities, types, sprints]) => {
        setMeta({ statuses, priorities, types, sprints });
        setError(null);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { meta, loading, error };
}
