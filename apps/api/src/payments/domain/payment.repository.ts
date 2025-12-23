import { ExportRequest } from '@club-social/shared/types';

import {
  PaginatedRepository,
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from './entities/payment.entity';
import {
  PaymentDetailModel,
  PaymentDueDetailModel,
  PaymentPaginatedModel,
  PaymentPaginatedSummaryModel,
} from './payment.types';

export const PAYMENT_REPOSITORY_PROVIDER = Symbol('PaymentRepository');

export interface PaymentRepository
  extends
    PaginatedRepository<PaymentPaginatedModel, PaymentPaginatedSummaryModel>,
    ReadableRepository<PaymentEntity>,
    WriteableRepository<PaymentEntity> {
  findForExport(params: ExportRequest): Promise<PaymentPaginatedModel[]>;
  findOneModel(id: UniqueId): Promise<null | PaymentDetailModel>;
  findPaymentDuesModel(paymentId: UniqueId): Promise<PaymentDueDetailModel[]>;
}
