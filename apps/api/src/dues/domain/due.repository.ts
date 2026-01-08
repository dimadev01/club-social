import { DateRangeDto, ExportDataDto } from '@club-social/shared/types';

import {
  PaginatedRepository,
  QueryContext,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import {
  DuePaginatedExtraReadModel,
  DuePaginatedReadModel,
  DueReadModel,
} from './due-read-models';
import { DueEntity } from './entities/due.entity';

export const DUE_REPOSITORY_PROVIDER = Symbol('DueRepository');

export interface DueRepository
  extends
    PaginatedRepository<DuePaginatedReadModel, DuePaginatedExtraReadModel>,
    ReadableRepository<DueEntity>,
    WriteableRepository<DueEntity> {
  findByIdReadModel(
    id: UniqueId,
    context?: QueryContext,
  ): Promise<DueReadModel | null>;
  findByIdsReadModel(
    ids: UniqueId[],
    context?: QueryContext,
  ): Promise<DueReadModel[]>;
  findForExport(
    params: ExportDataDto,
    context?: QueryContext,
  ): Promise<DuePaginatedReadModel[]>;
  findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
  findPendingForStatistics(
    params: DateRangeDto,
    context?: QueryContext,
  ): Promise<DueEntity[]>;
}
