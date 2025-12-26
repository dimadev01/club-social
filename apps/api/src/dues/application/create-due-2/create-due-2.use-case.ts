import { DueCategory } from '@club-social/shared/dues';
import { Inject } from '@nestjs/common';

import type { Due2Repository } from '@/dues/domain/due-2.repository';
import type { Result } from '@/shared/domain/result';

import { DUE_REPOSITORY_PROVIDER } from '@/dues/domain/due.repository';
import { DueEntity2 } from '@/dues/domain/entities/due-2.entity';
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

export interface CreateDueParams {
  amount: number;
  category: DueCategory;
  createdBy: string;
  date: string;
  memberId: string;
  notes: null | string;
}

export class CreateDue2UseCase extends UseCase<DueEntity2> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: Due2Repository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: CreateDueParams): Promise<Result<DueEntity2>> {
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

    const due = DueEntity2.create({
      amount,
      category: params.category,
      createdBy: params.createdBy,
      date,
      memberId: UniqueId.raw({ value: params.memberId }),
      notes: params.notes,
    });

    if (due.isErr()) {
      return err(due.error);
    }

    await this.dueRepository.save(due.value);
    this.eventPublisher.dispatch(due.value);

    return ok(due.value);
  }
}
