import type { PaginatedRequestParams, PaginatedResponse } from './types';
import type { UniqueId } from './value-objects/unique-id/unique-id.vo';

export interface PaginatedRepository<T> {
  findPaginated(params: PaginatedRequestParams): Promise<PaginatedResponse<T>>;
}

export interface ReadableRepository<T> {
  findOneById(id: UniqueId): Promise<null | T>;
  findOneByIdOrThrow(id: UniqueId): Promise<T>;
}

export interface WritableRepository<T> {
  delete(entity: T): Promise<void>;
  save(entity: T): Promise<T>;
}
