import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import { PaymentDueEntity } from '@/payments/domain/entities/payment-due.entity';
import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { DueDetailModel, DuePaginatedModel } from './due.types';
import { DueEntity } from './entities/due.entity';

export const DUE_REPOSITORY_PROVIDER = Symbol('DueRepository');

export interface DueRepository
  extends ReadableRepository<DueEntity>, WriteableRepository<DueEntity> {
  findByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
  findManyByIdsModels(ids: UniqueId[]): Promise<DueDetailModel[]>;
  findOneModel(id: UniqueId): Promise<DueDetailModel | null>;
  findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<DuePaginatedModel>>;
  findPaymentDues(dueId: UniqueId): Promise<PaymentDueEntity[]>;
  findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
}
