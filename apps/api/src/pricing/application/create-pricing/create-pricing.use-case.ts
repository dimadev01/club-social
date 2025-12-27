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
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

import type { CreatePricingParams } from './create-pricing.params';

export class CreatePricingUseCase extends UseCase<PricingEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreatePricingParams,
  ): Promise<Result<PricingEntity>> {
    this.logger.info({
      message: 'Creating pricing rule',
      params,
    });

    const results = ResultUtils.combine([
      Amount.fromCents(params.amount),
      DateOnly.fromString(params.effectiveFrom),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, effectiveFrom] = results.value;

    const pricing = PricingEntity.create(
      {
        amount,
        dueCategory: params.dueCategory,
        effectiveFrom,
        memberCategory: params.memberCategory,
      },
      params.createdBy,
    );

    if (pricing.isErr()) {
      return err(pricing.error);
    }

    // Find all prices that would overlap with the new pricing
    const overlapping = await this.pricingRepository.findOverlapping({
      dueCategory: params.dueCategory,
      effectiveFrom,
      memberCategory: params.memberCategory,
    });

    // Handle overlapping prices:
    // 1. Prices that start before new pricing: close them one day before new pricing starts
    // 2. Prices that start on or after new pricing: delete them (they're superseded)
    for (const existing of overlapping) {
      if (existing.effectiveFrom.isBefore(effectiveFrom)) {
        // Existing pricing starts before new one - close it one day before new pricing
        existing.close(effectiveFrom.subtractDays(1), params.createdBy);
      } else {
        // Existing pricing starts on or after new one - mark it as deleted (superseded)
        existing.delete(params.createdBy, new Date());
      }

      await this.pricingRepository.save(existing);
      this.eventPublisher.dispatch(existing);
    }

    await this.pricingRepository.save(pricing.value);
    this.eventPublisher.dispatch(pricing.value);

    return ok(pricing.value);
  }
}
