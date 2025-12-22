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
import { UniqueId } from '@/shared/domain/value-objects/unique-id/unique-id.vo';

import type { VoidMovementParams } from './void-movement.params';

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

    const movement = await this.movementRepository.findUniqueOrThrow(
      UniqueId.raw({ value: params.id }),
    );

    const voidResult = movement.void({
      voidedBy: params.voidedBy,
      voidReason: params.voidReason,
    });

    if (voidResult.isErr()) {
      return err(voidResult.error);
    }

    await this.movementRepository.save(movement);
    this.eventPublisher.dispatch(movement);

    return ok();
  }
}
