import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';

export class GetMembersForCsvRequestDto extends PaginatedRequestDto {
  public sortField:
    | 'name'
    | 'user.profile.lastName'
    | 'electricityDebt'
    | 'guestDebt'
    | 'membershipDebt';
}
