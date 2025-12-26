import { ExportRequest } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  DueDetailModel,
  DuePaginatedExtraModel,
  DuePaginatedModel,
  PaymentDueDetailModel,
} from './due.types';
import { DueEntity2 } from './entities/due-2.entity';

export const DUE_REPOSITORY_PROVIDER = Symbol('DueRepository');

export interface Due2Repository
  extends
    PaginatedRepository<DuePaginatedModel, DuePaginatedExtraModel>,
    ReadableRepository<DueEntity2>,
    WriteableRepository<DueEntity2> {
  findByMemberId(memberId: UniqueId): Promise<DueEntity2[]>;
  findForExport(params: ExportRequest): Promise<DuePaginatedModel[]>;
  findManyByIdsModels(ids: UniqueId[]): Promise<DueDetailModel[]>;
  findOneModel(id: UniqueId): Promise<DueDetailModel | null>;
  findPaymentDuesModel(dueId: UniqueId): Promise<PaymentDueDetailModel[]>;
  findPending(): Promise<DueEntity2[]>;
  findPendingByMemberId(memberId: UniqueId): Promise<DueEntity2[]>;
}
