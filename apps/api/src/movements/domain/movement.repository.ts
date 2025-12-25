import { ExportRequest } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from './entities/movement.entity';
import {
  MovementBalanceModel,
  MovementPaginatedExtraModel,
  MovementStatisticsModel,
} from './movement.types';

export const MOVEMENT_REPOSITORY_PROVIDER = Symbol('MovementRepository');

export interface GetMovementStatisticsParams {
  dateRange?: [string, string];
}

export interface MovementRepository
  extends
    PaginatedRepository<MovementEntity, MovementPaginatedExtraModel>,
    ReadableRepository<MovementEntity>,
    WriteableRepository<MovementEntity> {
  findByPaymentId(paymentId: UniqueId): Promise<MovementEntity | null>;
  findForExport(params: ExportRequest): Promise<MovementEntity[]>;
  getGlobalBalance(): Promise<MovementBalanceModel>;
  getStatistics(
    params: GetMovementStatisticsParams,
  ): Promise<MovementStatisticsModel>;
}
