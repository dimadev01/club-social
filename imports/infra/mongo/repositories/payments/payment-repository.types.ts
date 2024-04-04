import { FindPaginatedAggregationResult } from '@application/pagination/find-paginated-aggregation.result';
import { FindPaginatedRequest } from '@application/pagination/find-paginated.request';
import { FindPaginatedResponse } from '@application/pagination/find-paginated.response';
import { Payment } from '@domain/payments/entities/payment.entity';

export type FindByReceiptNumber = {
  receiptNumber: number;
};

export type FindPaginatedPaymentsAggregationResult =
  FindPaginatedAggregationResult<Payment> & {
    totalAmount: number;
  };

export type FindPaginatedPaymentsRequest = FindPaginatedRequest & {
  from: string | null;
  memberIds: string[];
  showDeleted: boolean | null;
  sortField: string;
  to: string | null;
};

export type FindPaginatedPaymentsResponse = FindPaginatedResponse<Payment> & {
  totalAmount: number;
};

export type FindPaidRequest = {
  memberId?: string;
};
