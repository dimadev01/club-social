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
import { err, ok } from '@/shared/domain/result';
import {
  UNIT_OF_WORK_PROVIDER,
  type UnitOfWork,
} from '@/shared/domain/unit-of-work';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

export interface UpdateDueParams {
  amount: number;
  id: string;
  notes: null | string;
  updatedBy: string;
}

export class UpdateDueUseCase extends UseCase<DueEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(DUE_REPOSITORY_PROVIDER)
    private readonly dueRepository: DueRepository,
    @Inject(UNIT_OF_WORK_PROVIDER)
    private readonly unitOfWork: UnitOfWork,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: UpdateDueParams): Promise<Result<DueEntity>> {
    this.logger.info({
      message: 'Updating due',
      params,
    });

    const due = await this.dueRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const amount = Amount.fromCents(params.amount);

    if (amount.isErr()) {
      return err(amount.error);
    }

    const updateResult = due.update({
      amount: amount.value,
      notes: params.notes,
      updatedBy: params.updatedBy,
    });

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    await this.unitOfWork.execute(async ({ duesRepository }) => {
      await duesRepository.save(due);
    });

    this.eventPublisher.dispatch(due);

    return ok(due);
  }
}
