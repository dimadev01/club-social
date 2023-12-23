import { PaymentGridDto } from '@domain/payments/use-cases/get-payments-grid/payment-grid.dto';
import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetPaymentsGridResponseDto extends PaginatedResponse<PaymentGridDto> {
  totalAmount: string;
}
