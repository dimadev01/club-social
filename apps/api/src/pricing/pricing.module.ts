import { Module } from '@nestjs/common';

import { CreatePricingUseCase } from './application/create-pricing.use-case';
import { FindActivePricingUseCase } from './application/find-active-pricing.use-case';
import { UpdatePricingUseCase } from './application/update-pricing.use-case';
import { PRICING_REPOSITORY_PROVIDER } from './domain/pricing.repository';
import { PrismaPricingMapper } from './infrastructure/prisma-pricing.mapper';
import { PrismaPricingRepository } from './infrastructure/prisma-pricing.repository';
import { PricingController } from './presentation/pricing.controller';

@Module({
  controllers: [PricingController],
  exports: [PRICING_REPOSITORY_PROVIDER],
  imports: [],
  providers: [
    CreatePricingUseCase,
    FindActivePricingUseCase,
    UpdatePricingUseCase,
    PrismaPricingMapper,
    {
      provide: PRICING_REPOSITORY_PROVIDER,
      useClass: PrismaPricingRepository,
    },
  ],
})
export class PricingModule {}
