import { PaymentGridDto } from '@application/payments/dtos/payment-grid-dto';
import { FindPaginatedPaymentsResponse } from '@domain/payments/repositories/payment-repository.types';

export type GetPaymentsGridResponse =
  FindPaginatedPaymentsResponse<PaymentGridDto>;
