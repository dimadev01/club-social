import { FindMembershipPricingDto } from '@club-social/shared/pricing';
import { IsUUID } from 'class-validator';

export class FindMembershipPricingRequestDto implements FindMembershipPricingDto {
  @IsUUID()
  public memberId: string;
}
