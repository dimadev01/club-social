import type {
  PaginatedRequest,
  PaginatedResponse,
} from '@club-social/shared/types';

import {
  ReadableRepository,
  WriteableRepository,
} from '@/shared/domain/repository';

import { PaymentEntity } from './entities/payment.entity';

export const PAYMENT_REPOSITORY_PROVIDER = Symbol('PaymentRepository');

export interface PaymentRepository
  extends
    ReadableRepository<PaymentEntity>,
    WriteableRepository<PaymentEntity> {
  findPaginated(
    params: PaginatedRequest,
  ): Promise<PaginatedResponse<PaymentEntity>>;
}
