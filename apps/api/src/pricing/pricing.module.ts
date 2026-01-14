import { Module } from '@nestjs/common';

import { CreatePricingUseCase } from './application/create-pricing.use-case';
import { GetMembershipPricingUseCase } from './application/get-membership-pricing.use-case';
import { UpdatePricingUseCase } from './application/update-pricing.use-case';
import {
  PRICING_OVERLAP_SERVICE_PROVIDER,
  PricingOverlapService,
} from './domain/services/pricing-overlap.service';
import { PricingController } from './presentation/pricing.controller';

@Module({
  controllers: [PricingController],
  exports: [],
  imports: [],
  providers: [
    CreatePricingUseCase,
    GetMembershipPricingUseCase,
    UpdatePricingUseCase,
    {
      provide: PRICING_OVERLAP_SERVICE_PROVIDER,
      useClass: PricingOverlapService,
    },
  ],
})
export class PricingModule {}
