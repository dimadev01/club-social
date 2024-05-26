import { IsNotEmpty, IsString } from 'class-validator';

import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';

export class GetMembersGridRequestDto extends PaginatedRequestDto {
  @IsNotEmpty()
  @IsString()
  public sortField:
    | 'name'
    | 'user.profile.lastName'
    | 'electricityDebt'
    | 'guestDebt'
    | 'membershipDebt';
}
