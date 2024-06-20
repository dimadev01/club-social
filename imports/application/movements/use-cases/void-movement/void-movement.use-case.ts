import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { IUseCase } from '@application/common/use-case.interface';
import { IEventRepository } from '@application/events/repositories/event.repository';
import { IMovementRepository } from '@application/movements/repositories/movement.repository';
import { VoidMovementRequest } from '@application/movements/use-cases/void-movement/void-movement.request';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { Event } from '@domain/events/models/event.model';

@injectable()
export class VoidMovementUseCase
  implements IUseCase<VoidMovementRequest, null>
{
  public constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
    @inject(DIToken.IEventRepository)
    private readonly _eventRepository: IEventRepository,
  ) {}

  public async execute(
    request: VoidMovementRequest,
  ): Promise<Result<null, Error>> {
    const movement = await this._movementRepository.findOneByIdOrThrow(request);

    const voidResult = movement.void(request.voidedBy, request.voidReason);

    if (voidResult.isErr()) {
      throw voidResult.error;
    }

    const event = Event.create({
      action: EventActionEnum.VOID,
      description: null,
      resource: EventResourceEnum.MOVEMENTS,
      resourceId: movement._id,
    });

    if (event.isErr()) {
      throw event.error;
    }

    if (request.unitOfWork) {
      await this._movementRepository.updateWithSession(
        movement,
        request.unitOfWork,
      );

      await this._eventRepository.insertWithSession(
        event.value,
        request.unitOfWork,
      );
    } else {
      await this._movementRepository.update(movement);

      await this._eventRepository.insert(event.value);
    }

    this._logger.info('Movement voided', { movement: request.id });

    return ok(null);
  }
}
