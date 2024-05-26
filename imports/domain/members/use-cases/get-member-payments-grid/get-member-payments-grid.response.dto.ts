import { MemberPaymentGridDto } from './member-payment-grid.dto';

import { PaginatedResponse } from '@infra/pagination/paginated-response.dto';

export class GetMemberPaymentsGridResponseDto extends PaginatedResponse<MemberPaymentGridDto> {
  totalAmount: string;
}
