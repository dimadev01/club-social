import {
  FindByReceiptNumberRequest,
  FindPaginatedPaymentsRequest,
  FindPaginatedPaymentsResponse,
} from '@adapters/repositories/payments/payment-repository.types';
import { ICrudPort } from '@application/ports/crud.port';
import { IPaginatedPort } from '@application/ports/paginated.port';
import { PaymentOld } from '@domain/payments/entities/payment.entity';

export interface IPaymentPort
  extends ICrudPort<PaymentOld>,
    IPaginatedPort<PaymentOld> {
  findLastByReceiptNumber(): Promise<PaymentOld | null>;
  findOneByReceiptNumber(
    request: FindByReceiptNumberRequest,
  ): Promise<PaymentOld | null>;
  findPaginated(
    request: FindPaginatedPaymentsRequest,
  ): Promise<FindPaginatedPaymentsResponse>;
}
