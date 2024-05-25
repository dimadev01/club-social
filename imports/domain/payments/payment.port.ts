import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { Payment } from '@domain/payments/entities/payment.entity';
import {
  FindByReceiptNumberRequest,
  FindPaginatedPaymentsRequest,
  FindPaginatedPaymentsResponse,
} from '@infra/mongo/repositories/payments/payment-repository.types';

export interface IPaymentPort
  extends ICrudPort<Payment>,
    IPaginatedPort<Payment> {
  findLastByReceiptNumber(): Promise<Payment | null>;
  findOneByReceiptNumber(
    request: FindByReceiptNumberRequest,
  ): Promise<Payment | null>;
  findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedPaymentsResponse>;
}
