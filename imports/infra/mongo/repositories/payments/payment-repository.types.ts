import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequestOld } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponseOld } from '@application/pagination/find-paginated.response';
import { Payment } from '@domain/payments/entities/payment.entity';

export type FindByReceiptNumberRequest = {
  receiptNumber: number;
};

export type FindPaginatedPaymentsAggregationResult =
  FindPaginatedAggregationResult<Payment> & {
    totalAmount: number;
  };

export type FindPaginatedPaymentsRequest = FindPaginatedRequestOld & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: string;
  to: string | null;
};

export type FindPaginatedPaymentsResponse =
  FindPaginatedResponseOld<Payment> & {
    totalAmount: number;
  };

export type FindPaidRequest = {
  memberId?: string;
};
