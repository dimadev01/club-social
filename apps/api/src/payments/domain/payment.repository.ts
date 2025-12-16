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

export const PAYMENT_REPOSITORY_PROVIDER = Symbol('PaymentRepository');

export interface PaymentListParams extends PaginatedRequest {
  dueId?: string;
}

export interface PaymentRepository
  extends
    ReadableRepository<PaymentEntity>,
    WriteableRepository<PaymentEntity> {
  findByDueId(dueId: UniqueId): Promise<PaymentEntity[]>;
  findPaginated(
    params: PaymentListParams,
  ): Promise<PaginatedResponse<PaymentEntity>>;
}
