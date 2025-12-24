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
import { err, ok } from '@/shared/domain/result';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

import type { FindActivePricingParams } from './find-active-pricing.params';

export class FindActivePricingUseCase extends UseCase<null | PricingEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
  ) {
    super(logger);
  }

  public async execute(
    params: FindActivePricingParams,
  ): Promise<Result<null | PricingEntity>> {
    const dateResult = DateOnly.fromString(params.date);

    if (dateResult.isErr()) {
      return err(dateResult.error);
    }

    const date = dateResult.value;

    const pricing = await this.pricingRepository.findOneActive(
      params.dueCategory,
      params.memberCategory,
      date,
    );

    return ok(pricing);
  }
}
