import { IsNotEmpty, IsString } from 'class-validator';
import { PaginatedRequestDto } from '@infra/pagination/paginated-request.dto';

export class GetMembersGridRequestDto extends PaginatedRequestDto {
  @IsString()
  @IsNotEmpty()
  public sortField:
    | 'name'
    | 'user.profile.lastName'
    | 'electricityDebt'
    | 'guestDebt'
    | 'membershipDebt';
}
