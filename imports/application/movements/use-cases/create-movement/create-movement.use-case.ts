import { Result, err } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MovementDto } from '@application/movements/dtos/movement.dto';
import { CreateMovementRequest } from '@application/movements/use-cases/create-movement/create-movement.request';
import { GetMovementUseCase } from '@application/movements/use-cases/get-movement/get-movement.use.case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Movement } from '@domain/movements/models/movement.model';
import { IMovementRepository } from '@domain/movements/movement.repository';
import { ErrorUtils } from '@shared/utils/error.utils';

@injectable()
export class CreateMovementUseCase
  implements IUseCase<CreateMovementRequest, MovementDto>
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
    request: CreateMovementRequest,
  ): Promise<Result<MovementDto, Error>> {
    try {
      this._unitOfWork.start();

      let newMovementId: string | undefined;

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const movement = Movement.createOne({
          amount: new Money({ amount: request.amount }),
          category: request.category,
          date: new DateUtcVo(request.date),
          employeeId: null,
          notes: request.notes,
          paymentId: null,
          professorId: null,
          serviceId: null,
          type: request.type,
        });

        if (movement.isErr()) {
          throw movement.error;
        }

        await this._movementRepository.insertWithSession(
          movement.value,
          unitOfWork,
        );

        newMovementId = movement.value._id;
      });

      invariant(newMovementId);

      return await this._getMovementUseCase.execute({ id: newMovementId });
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await this._unitOfWork.end();
    }
  }
}
