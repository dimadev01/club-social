import { Result, err } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { IEventRepository } from '@application/events/repositories/event.repository';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { IMovementRepository } from '@application/movements/repositories/movement.repository';
import { GetMovementUseCase } from '@application/movements/use-cases/get-movement/get-movement.use.case';
import { UpdateMovementRequest } from '@application/movements/use-cases/update-movement/update-movement.request';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { ModelNotUpdatableError } from '@domain/common/errors/model-not-updatable.error';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { EventActionEnum, EventResourceEnum } from '@domain/events/event.enum';
import { Event } from '@domain/events/models/event.model';

@injectable()
export class UpdateMovementUseCase
  implements IUseCase<UpdateMovementRequest, MovementDto>
{
  public constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
    @inject(DIToken.IEventRepository)
    private readonly _eventRepository: IEventRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    private readonly _getMovementUseCase: GetMovementUseCase,
  ) {}

  public async execute(
    request: UpdateMovementRequest,
  ): Promise<Result<MovementDto, Error>> {
    try {
      this._unitOfWork.start();

      const movement = await this._movementRepository.findOneByIdOrThrow({
        id: request.id,
      });

      if (!movement.isUpdatable()) {
        return err(new ModelNotUpdatableError());
      }

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const amount = Money.create({ amount: request.amount });

        if (amount.isErr()) {
          throw amount.error;
        }

        const result = Result.combine([
          movement.setAmount(amount.value),
          movement.setCategory(request.category),
          movement.setDate(new DateVo(request.date)),
          movement.setNotes(request.notes),
          movement.setType(request.type),
        ]);

        if (result.isErr()) {
          throw result.error;
        }

        await this._movementRepository.updateWithSession(movement, unitOfWork);

        const event = Event.create({
          action: EventActionEnum.UPDATE,
          description: null,
          resource: EventResourceEnum.MOVEMENTS,
          resourceId: movement._id,
        });

        if (event.isErr()) {
          throw event.error;
        }

        await this._eventRepository.insertWithSession(event.value, unitOfWork);
      });

      return await this._getMovementUseCase.execute({ id: movement._id });
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await this._unitOfWork.end();
    }
  }
}
