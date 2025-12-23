import { IPaymentPaginatedSummaryDto } from '@club-social/shared/payments';

export class PaymentPaginatedSummaryDto implements IPaymentPaginatedSummaryDto {
  public totalAmount: number;
}
