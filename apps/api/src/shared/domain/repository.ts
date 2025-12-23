import { PaginatedRequest, PaginatedResponse } from '@club-social/shared/types';

import type { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface PaginatedRepository<T, TSummary = never> {
  findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<T, TSummary>>;
}

export interface ReadableRepository<T> {
  findUniqueById(id: UniqueId): Promise<null | T>;
  findUniqueByIds(ids: UniqueId[]): Promise<T[]>;
  findUniqueOrThrow(id: UniqueId): Promise<T>;
}

export interface WriteableRepository<T> {
  save(entity: T): Promise<T>;
}
