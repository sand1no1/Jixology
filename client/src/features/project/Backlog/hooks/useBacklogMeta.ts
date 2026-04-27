import { useEffect, useState } from 'react';
import {
  fetchBacklogStatuses,
  fetchBacklogPriorities,
  fetchBacklogTypes,
  fetchSprintsByProject,
  fetchBacklogItems,
  fetchProjectMembers,
  fetchSugerencias,
} from '../services/backlog.service';
import type { BacklogMeta } from '../types/backlog.types';

const EMPTY: BacklogMeta = { statuses: [], priorities: [], types: [], sprints: [], items: [], users: [], sugerencias: [] };

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
      fetchBacklogItems(projectId),
      fetchProjectMembers(projectId),
      fetchSugerencias(projectId),
    ])
      .then(([statuses, priorities, types, sprints, items, users, sugerencias]) => {
        setMeta({ statuses, priorities, types, sprints, items, users, sugerencias });
        setError(null);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [projectId]);

  return { meta, loading, error };
}
