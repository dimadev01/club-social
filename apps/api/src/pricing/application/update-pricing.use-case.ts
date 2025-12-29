import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface UpdatePricingParams {
  amount: number;
  effectiveFrom: string;
  id: string;
  updatedBy: string;
}

export class UpdatePricingUseCase extends UseCase<void> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: UpdatePricingParams): Promise<Result<void>> {
    this.logger.info({
      message: 'Updating pricing rule',
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

    const pricing = await this.pricingRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const updateResult = pricing.update({
      amount,
      effectiveFrom,
      updatedBy: params.updatedBy,
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    // Find all prices that would overlap with the updated pricing (excluding itself)
    const overlapping = await this.pricingRepository.findOverlapping({
      dueCategory: pricing.dueCategory,
      effectiveFrom,
      excludeId: pricing.id,
      memberCategory: pricing.memberCategory,
    });

    // Handle overlapping prices the same way as create:
    // 1. Prices that start before updated pricing: close them one day before
    // 2. Prices that start on or after updated pricing: delete them (superseded)
    for (const existing of overlapping) {
      if (existing.effectiveFrom.isBefore(effectiveFrom)) {
        // Existing pricing starts before updated one - close it one day before
        existing.close(effectiveFrom.subtractDays(1), params.updatedBy);
      } else {
        // Existing pricing starts on or after updated one - mark it as deleted
        existing.delete(params.updatedBy, new Date());
      }

      await this.pricingRepository.save(existing);
      this.eventPublisher.dispatch(existing);
    }

    await this.pricingRepository.save(pricing);
    this.eventPublisher.dispatch(pricing);

    return ok();
  }
}
