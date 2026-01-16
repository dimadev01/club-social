import { Module } from '@nestjs/common';

import { CreatePricingUseCase } from './application/create-pricing.use-case';
import { FindPricingUseCase } from './application/find-pricing.use-case';
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
    FindPricingUseCase,
    UpdatePricingUseCase,
    {
      provide: PRICING_OVERLAP_SERVICE_PROVIDER,
      useClass: PricingOverlapService,
    },
  ],
})
export class PricingModule {}
