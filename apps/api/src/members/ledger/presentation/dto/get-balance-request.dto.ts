import { GetMemberBalanceDto } from '@club-social/shared/members';
import { IsUUID } from 'class-validator';

export class GetMemberBalanceRequestDto implements GetMemberBalanceDto {
  @IsUUID()
  public memberId: string;
}
