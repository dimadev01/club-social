import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import {
  DUE_REPOSITORY_PROVIDER,
  type DueRepository,
} from '@/dues/domain/due.repository';
import { DueEntity } from '@/dues/domain/entities/due.entity';
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

import type { CreateDueParams } from './create-due.params';

export class CreateDueUseCase extends UseCase<DueEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: CreateDueParams): Promise<Result<DueEntity>> {
    this.logger.info({
      message: 'Creating due',
      params,
    });

    const results = ResultUtils.combine([
      Amount.fromCents(params.amount),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, date] = results.value;

    const due = DueEntity.create(
      {
        amount,
        category: params.category,
        date,
        memberId: UniqueId.raw({ value: params.memberId }),
        notes: params.notes,
      },
      params.createdBy,
    );

    if (due.isErr()) {
      return err(due.error);
    }

    await this.dueRepository.save(due.value);
    this.eventPublisher.dispatch(due.value);

    return ok(due.value);
  }
}
