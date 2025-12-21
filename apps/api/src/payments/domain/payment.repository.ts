import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { PaymentEntity } from './entities/payment.entity';
import { PaymentDetailModel, PaymentPaginatedModel } from './payment.types';

export const PAYMENT_REPOSITORY_PROVIDER = Symbol('PaymentRepository');

export interface PaymentRepository
  extends
    ReadableRepository<PaymentEntity>,
    WriteableRepository<PaymentEntity> {
  findOneModel(id: UniqueId): Promise<null | PaymentDetailModel>;
  findPaginatedModel(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<PaymentPaginatedModel>>;
}
