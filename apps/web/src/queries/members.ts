import type { QueryClient } from '@tanstack/react-query';

export const membersKeys = {
  all: ['members'] as const,
  detail: (id: string) => [...membersKeys.details(), id] as const,
  details: () => [...membersKeys.all, 'detail'] as const,
  list: (filters: { projectId?: string }) =>
    [...membersKeys.lists(), filters] as const,
  lists: () => [...membersKeys.all, 'list'] as const,
};

export const membersInvalidate = {
  all: (qc: QueryClient) => qc.invalidateQueries({ queryKey: membersKeys.all }),
  detail: (qc: QueryClient, id: string) =>
    qc.invalidateQueries({ queryKey: membersKeys.detail(id) }),
  lists: (qc: QueryClient) =>
    qc.invalidateQueries({ queryKey: membersKeys.lists() }),
};
