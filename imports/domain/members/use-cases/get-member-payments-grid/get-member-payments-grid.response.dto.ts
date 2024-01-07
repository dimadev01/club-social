import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';
import { MemberPaymentGridDto } from './member-payment-grid.dto';

export class GetMemberPaymentsGridResponseDto extends PaginatedResponse<MemberPaymentGridDto> {
  totalAmount: string;
}
