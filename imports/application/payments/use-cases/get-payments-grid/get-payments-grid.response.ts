import { Payment } from '@domain/payments/models/payment.model';
import { FindPaginatedPaymentsResponse } from '@domain/payments/payment.repository';

export type GetPaymentsGridResponse<T = Payment> =
  FindPaginatedPaymentsResponse<T>;
