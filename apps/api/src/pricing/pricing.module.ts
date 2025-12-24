import { Module } from '@nestjs/common';

import { CreatePricingUseCase } from './application/create-pricing/create-pricing.use-case';
import { FindActivePricingUseCase } from './application/find-active-pricing/find-active-pricing.use-case';
import { UpdatePricingUseCase } from './application/update-pricing/update-pricing.use-case';
import { PRICING_REPOSITORY_PROVIDER } from './domain/pricing.repository';
import { PrismaPricingMapper } from './infrastructure/prisma-pricing.mapper';
import { PrismaPricingRepository } from './infrastructure/prisma-pricing.repository';
import { PricingController } from './presentation/pricing.controller';

@Module({
  controllers: [PricingController],
  exports: [PRICING_REPOSITORY_PROVIDER, FindActivePricingUseCase],
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
