import type { PaginatedRequestParams, PaginatedResponse } from './types';
import type { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface PaginatedRepository<T> {
  findPaginated(params: PaginatedRequestParams): Promise<PaginatedResponse<T>>;
}

export interface ReadableRepository<T> {
  findManyByIds(ids: UniqueId[]): Promise<T[]>;
  findOneById(id: UniqueId): Promise<null | T>;
  findOneByIdOrThrow(id: UniqueId): Promise<T>;
}

export interface WriteableRepository<T> {
  save(entity: T): Promise<T>;
}
