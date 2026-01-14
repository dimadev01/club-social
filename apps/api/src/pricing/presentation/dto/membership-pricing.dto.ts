import { MembershipPricingDto } from '@club-social/shared/pricing';

export class MembershipPricingResponseDto implements MembershipPricingDto {
  public amount: number;
  public baseAmount: number;
  public discountPercent: number;
  public groupSize: number;
}
