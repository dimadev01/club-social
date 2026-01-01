import { DateRangeDto, ExportDataDto } from '@club-social/shared/types';

import {
  PaginatedRepository,
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
  findByIdReadModel(id: UniqueId): Promise<DueReadModel | null>;
  findByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
  findForExport(params: ExportDataDto): Promise<DuePaginatedReadModel[]>;
  findPending(params: DateRangeDto): Promise<DueEntity[]>;
  findPendingByMemberId(memberId: UniqueId): Promise<DueEntity[]>;
}
