import { DueCategory } from '@club-social/shared/dues';
import { MemberCategory } from '@club-social/shared/members';
import { Inject, Injectable } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { PricingEntity } from '@/pricing/domain/entities/pricing.entity';
import { PricingService } from '@/pricing/domain/services/pricing.service';
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

interface CreatePricingParams {
  amount: number;
  createdBy: string;
  dueCategory: DueCategory;
  effectiveFrom: string;
  memberCategory: MemberCategory | null;
}

@Injectable()
export class CreatePricingUseCase extends UseCase<PricingEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly pricingService: PricingService,
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

    const { toClose, toDelete } = await this.pricingService.resolveOverlaps({
      dueCategory: params.dueCategory,
      effectiveFrom,
      memberCategory: params.memberCategory,
      updatedBy: params.createdBy,
    });

    await this.unitOfWork.execute(async ({ pricingRepository }) => {
      await Promise.all(toClose.map((price) => pricingRepository.save(price)));
      await Promise.all(toDelete.map((price) => pricingRepository.save(price)));
      await pricingRepository.save(pricing.value);
    });

    toClose.forEach((price) => this.eventPublisher.dispatch(price));
    toDelete.forEach((price) => this.eventPublisher.dispatch(price));
    this.eventPublisher.dispatch(pricing.value);

    return ok(pricing.value);
  }
}
