import { Module } from '@nestjs/common';

import { CreatePricingUseCase } from './application/create-pricing.use-case';
import { FindActivePricingUseCase } from './application/find-active-pricing.use-case';
import { UpdatePricingUseCase } from './application/update-pricing.use-case';
import { PricingController } from './presentation/pricing.controller';

@Module({
  controllers: [PricingController],
  exports: [],
  imports: [],
  providers: [
    CreatePricingUseCase,
    FindActivePricingUseCase,
    UpdatePricingUseCase,
  ],
})
export class PricingModule {}
