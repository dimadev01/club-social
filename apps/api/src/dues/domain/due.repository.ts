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
  DuePendingStatisticsModel,
  PaymentDueDetailModel,
} from './due.types';
import { DueEntity } from './entities/due.entity';

export const DUE_REPOSITORY_PROVIDER = Symbol('DueRepository');

export interface DueRepository
  extends
    PaginatedRepository<DuePaginatedModel, DuePaginatedExtraModel>,
    ReadableRepository<DueEntity>,
    WriteableRepository<DueEntity> {
  findByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
  findForExport(params: ExportRequest): Promise<DuePaginatedModel[]>;
  findManyByIdsModels(ids: UniqueId[]): Promise<DueDetailModel[]>;
  findOneModel(id: UniqueId): Promise<DueDetailModel | null>;
  findPaymentDuesModel(dueId: UniqueId): Promise<PaymentDueDetailModel[]>;
  findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
  getPendingStatistics(): Promise<DuePendingStatisticsModel>;
}
