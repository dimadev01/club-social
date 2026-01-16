import { FoundPricingDto } from '@club-social/shared/pricing';

export class MembershipPricingResponseDto implements FoundPricingDto {
  public amount: number;
  public baseAmount: number;
  public discountPercent: number;
  public isGroupPricing: boolean;
}
