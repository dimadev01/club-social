import {
  MovementMode,
  MovementStatus,
  MovementType,
} from '@club-social/shared/movements';
import { Inject } from '@nestjs/common';

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
import { err, ok, type Result } from '@/shared/domain/result';
import { DateOnly } from '@/shared/domain/value-objects/date-only/date-only.vo';
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import { MovementEntity } from '../domain/entities/movement.entity';

export interface VoidMovementParams {
  id: string;
  voidedBy: string;
  voidReason: string;
}

export class VoidMovementUseCase extends UseCase {
  public constructor(
    @Inject(APP_LOGGER_PROVIDER)
    protected readonly logger: AppLogger,
    @Inject(MOVEMENT_REPOSITORY_PROVIDER)
    private readonly movementRepository: MovementRepository,
    private readonly eventPublisher: DomainEventPublisher,
  ) {
    super(logger);
  }

  public async execute(params: VoidMovementParams): Promise<Result> {
    this.logger.info({ message: 'Voiding movement', params });

    const originalMovement = await this.movementRepository.findByIdOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const voidResult = originalMovement.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    const reversedMovement = MovementEntity.create(
      {
        amount:
          originalMovement.type === MovementType.INFLOW
            ? originalMovement.amount.toNegative()
            : originalMovement.amount,
        category: originalMovement.category,
        date: DateOnly.today(),
        mode: MovementMode.AUTOMATIC,
        notes: originalMovement.notes,
        paymentId: originalMovement.paymentId,
        status: MovementStatus.REVERSED,
        type:
          originalMovement.type === MovementType.INFLOW
            ? MovementType.OUTFLOW
            : MovementType.INFLOW,
      },
      params.voidedBy,
    );

    if (reversedMovement.isErr()) {
      return err(reversedMovement.error);
    }

    await this.movementRepository.save(originalMovement);
    await this.movementRepository.save(reversedMovement.value);
    this.eventPublisher.dispatch(originalMovement);

    return ok();
  }
}
