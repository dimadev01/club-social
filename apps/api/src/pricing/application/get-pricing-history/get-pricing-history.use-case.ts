import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { PricingEntity } from '@/pricing/domain/entities/pricing.entity';
import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '@/pricing/domain/pricing.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { ok } from '@/shared/domain/result';

import type { GetPricingHistoryParams } from './get-pricing-history.params';

export class GetPricingHistoryUseCase extends UseCase<PricingEntity[]> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: GetPricingHistoryParams,
  ): Promise<Result<PricingEntity[]>> {
    const prices =
      await this.pricingRepository.findByDueCategoryAndMemberCategory(
        params.dueCategory,
        params.memberCategory,
      );

    return ok(prices);
  }
}
