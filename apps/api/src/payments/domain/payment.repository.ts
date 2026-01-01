import { DateRangeDto, ExportDataDto } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from './entities/payment.entity';
import {
  PaymentDailyStatisticsReadModel,
  PaymentPaginatedExtraReadModel,
  PaymentPaginatedReadModel,
  PaymentReadModel,
  PaymentStatisticsReadModel,
} from './payment-read-models';

export const PAYMENT_REPOSITORY_PROVIDER = Symbol('PaymentRepository');

export interface PaymentRepository
  extends
    PaginatedRepository<
      PaymentPaginatedReadModel,
      PaymentPaginatedExtraReadModel
    >,
    ReadableRepository<PaymentEntity>,
    WriteableRepository<PaymentEntity> {
  findByIdReadModel(id: UniqueId): Promise<null | PaymentReadModel>;
  findDailyStatistics(
    month: DateOnly,
  ): Promise<PaymentDailyStatisticsReadModel[]>;
  findForExport(params: ExportDataDto): Promise<PaymentPaginatedReadModel[]>;
  findForStatistics(
    params: DateRangeDto,
  ): Promise<PaymentStatisticsReadModel[]>;
}
