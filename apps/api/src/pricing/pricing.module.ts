import { Module } from '@nestjs/common';

import { CreatePricingUseCase } from './application/create-pricing.use-case';
import { FindPricingUseCase } from './application/find-pricing.use-case';
import { UpdatePricingUseCase } from './application/update-pricing.use-case';
import { PricingService } from './domain/services/pricing.service';
import { PricingController } from './presentation/pricing.controller';

@Module({
  controllers: [PricingController],
  exports: [PricingService],
  providers: [
    CreatePricingUseCase,
    FindPricingUseCase,
    UpdatePricingUseCase,
    PricingService,
  ],
})
export class PricingModule {}
