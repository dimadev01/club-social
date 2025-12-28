import {
  GetPaginatedDataDto,
  PaginatedDataResultDto,
} from '@club-social/shared/types';

import type { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface PaginatedRepository<TData, TSummary = never> {
  findPaginated(
    params: GetPaginatedDataDto,
  ): Promise<PaginatedDataResultDto<TData, TSummary>>;
}

export interface ReadableRepository<T> {
  findById(id: UniqueId): Promise<null | T>;
  findByIdOrThrow(id: UniqueId): Promise<T>;
  findByIds(ids: UniqueId[]): Promise<T[]>;
}

export interface WriteableRepository<T> {
  save(entity: T): Promise<void>;
}
