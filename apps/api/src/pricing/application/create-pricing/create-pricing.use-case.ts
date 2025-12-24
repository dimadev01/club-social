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
import { ApplicationError } from '@/shared/domain/errors/application.error';
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

    // Check for overlapping pricing
    const overlapping = await this.pricingRepository.findOverlapping({
      dueCategory: params.dueCategory,
      effectiveFrom,
      memberCategory: params.memberCategory,
    });

    if (overlapping.length > 0) {
      return err(
        new ApplicationError(
          `Overlapping pricing rules exist for ${params.dueCategory} / ${params.memberCategory}`,
        ),
      );
    }

    const pricing = PricingEntity.create({
      amount,
      createdBy: params.createdBy,
      dueCategory: params.dueCategory,
      effectiveFrom,
      memberCategory: params.memberCategory,
    });

    if (pricing.isErr()) {
      return err(pricing.error);
    }

    const activePricing = await this.pricingRepository.findUniqueActive(
      params.dueCategory,
      params.memberCategory,
    );

    if (activePricing) {
      activePricing.close(effectiveFrom, params.createdBy);
      await this.pricingRepository.save(activePricing);
      this.eventPublisher.dispatch(activePricing);
    }

    await this.pricingRepository.save(pricing.value);
    this.eventPublisher.dispatch(pricing.value);

    return ok(pricing.value);
  }
}
