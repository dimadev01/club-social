import { Result, err } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { GetMovementUseCase } from '@application/movements/use-cases/get-movement/get-movement.use.case';
import { UpdateMovementRequest } from '@application/movements/use-cases/update-movement/update-movement.request';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { ModelNotUpdatableError } from '@domain/common/errors/model-not-updatable.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { IMovementRepository } from '@domain/movements/movement.repository';

@injectable()
export class UpdateMovementUseCase
  implements IUseCase<UpdateMovementRequest, MovementDto>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
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
        const result = Result.combine([
          movement.setAmount(new Money({ amount: request.amount })),
          movement.setCategory(request.category),
          movement.setDate(new DateUtcVo(request.date)),
          movement.setNotes(request.notes),
          movement.setType(request.type),
        ]);

        if (result.isErr()) {
          throw result.error;
        }

        await this._movementRepository.updateWithSession(movement, unitOfWork);
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
