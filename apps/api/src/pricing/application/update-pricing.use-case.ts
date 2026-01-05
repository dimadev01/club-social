import { Inject, Injectable } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  PRICING_REPOSITORY_PROVIDER,
  type PricingRepository,
} from '@/pricing/domain/pricing.repository';
import {
  PRICING_OVERLAP_SERVICE_PROVIDER,
  type PricingOverlapService,
} from '@/pricing/domain/services/pricing-overlap.service';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

interface UpdatePricingParams {
  amount: number;
  effectiveFrom: string;
  id: string;
  updatedBy: string;
}

@Injectable()
export class UpdatePricingUseCase extends UseCase<void> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(PRICING_REPOSITORY_PROVIDER)
    private readonly pricingRepository: PricingRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    @Inject(PRICING_OVERLAP_SERVICE_PROVIDER)
    private readonly pricingOverlapService: PricingOverlapService,
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

    const { toClose, toDelete } =
      await this.pricingOverlapService.resolveOverlaps({
        dueCategory: pricing.dueCategory,
        effectiveFrom,
        excludeId: pricing.id,
        memberCategory: pricing.memberCategory,
        updatedBy: params.updatedBy,
      });

    await this.unitOfWork.execute(async ({ pricingRepository }) => {
      await Promise.all(toClose.map((price) => pricingRepository.save(price)));
      await Promise.all(toDelete.map((price) => pricingRepository.save(price)));
      await pricingRepository.save(pricing);
    });

    toClose.forEach((price) => this.eventPublisher.dispatch(price));
    toDelete.forEach((price) => this.eventPublisher.dispatch(price));
    this.eventPublisher.dispatch(pricing);

    return ok();
  }
}
