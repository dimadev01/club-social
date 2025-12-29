import { MovementMode } from '@club-social/shared/movements';
import { MovementCategory, MovementType } from '@club-social/shared/movements';
import { Inject } from '@nestjs/common';

import type { Result } from '@/shared/domain/result';

import { MovementEntity } from '@/movements/domain/entities/movement.entity';
import {
  MOVEMENT_REPOSITORY_PROVIDER,
  type MovementRepository,
} from '@/movements/domain/movement.repository';
import {
  APP_LOGGER_PROVIDER,
  type AppLogger,
} from '@/shared/application/app-logger';
import { UseCase } from '@/shared/application/use-case';
import { DomainEventPublisher } from '@/shared/domain/events/domain-event-publisher';
import { err, ok, ResultUtils } from '@/shared/domain/result';
import { Amount } from '@/shared/domain/value-objects/amount/amount.vo';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';

export interface CreateMovementParams {
  amount: number;
  category: MovementCategory;
  createdBy: string;
  date: string;
  notes: null | string;
  type: MovementType;
}

export class CreateMovementUseCase extends UseCase<MovementEntity> {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(
    params: CreateMovementParams,
  ): Promise<Result<MovementEntity>> {
    this.logger.info({ message: 'Creating movement', params });

    const results = ResultUtils.combine([
      Amount.fromCents(params.amount),
      DateOnly.fromString(params.date),
    ]);

    if (results.isErr()) {
      return err(results.error);
    }

    const [amount, date] = results.value;

    const movementResult = MovementEntity.create(
      {
        amount,
        category: params.category,
        date,
        mode: MovementMode.MANUAL,
        notes: params.notes,
        paymentId: null,
        type: params.type,
      },
      params.createdBy,
    );

    if (movementResult.isErr()) {
      return err(movementResult.error);
    }

    const movement = movementResult.value;

    await this.movementRepository.save(movement);
    this.eventPublisher.dispatch(movement);

    return ok(movement);
  }
}
