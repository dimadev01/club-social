import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DuePaginatedModel } from './due.types';
import { DueEntity } from './entities/due.entity';

export const DUE_REPOSITORY_PROVIDER = Symbol('DueRepository');

export interface DueRepository
  extends ReadableRepository<DueEntity>, WriteableRepository<DueEntity> {
  findByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
  findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<DuePaginatedModel>>;
  findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
}
