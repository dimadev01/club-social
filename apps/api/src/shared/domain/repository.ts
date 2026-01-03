import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import type { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface PaginatedRepository<TData, TSummary = never> {
  findPaginated(
    params: GetPaginatedDataDto,
    context?: QueryContext,
  ): Promise<PaginatedDataResultDto<TData, TSummary>>;
}

export interface QueryContext {
  memberId?: UniqueId;
}

export interface ReadableRepository<T> {
  findById(id: UniqueId, context?: QueryContext): Promise<null | T>;
  findByIdOrThrow(id: UniqueId, context?: QueryContext): Promise<T>;
  findByIds(ids: UniqueId[], context?: QueryContext): Promise<T[]>;
}

export interface WriteableRepository<T> {
  save(entity: T, tx?: unknown): Promise<void>;
}
