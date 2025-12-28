import { ExportDataDto } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { FindForStatisticsParams } from '@/shared/domain/repository-types';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from './entities/movement.entity';
import {
  MovementPaginatedExtraReadModel,
  MovementPaginatedReadModel,
  MovementReadModel,
} from './movement-read-models';
import { MovementStatisticsModel } from './movement.types';

export const MOVEMENT_REPOSITORY_PROVIDER = Symbol('MovementRepository');

export interface MovementRepository
  extends
    PaginatedRepository<
      MovementPaginatedReadModel,
      MovementPaginatedExtraReadModel
    >,
    ReadableRepository<MovementEntity>,
    WriteableRepository<MovementEntity> {
  findByIdReadModel(id: UniqueId): Promise<MovementReadModel | null>;
  findByPaymentId(paymentId: UniqueId): Promise<MovementEntity | null>;
  findForExport(params: ExportDataDto): Promise<MovementPaginatedReadModel[]>;
  findForStatistics(
    params: FindForStatisticsParams,
  ): Promise<MovementStatisticsModel>;
}
