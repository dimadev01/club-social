import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { Movement } from '@domain/movements/entities/movement.entity';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class UpdateMovementUseCase
  extends UseCase<UpdateMovementRequestDto>
  implements IUseCase<UpdateMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: UpdateMovementRequestDto
  ): Promise<Result<null, Error>> {
    this.validatePermission(Scope.Movements, Permission.Create);

    await this.validateDto(UpdateMovementRequestDto, request);

    const movement = await MovementsCollection.findOneAsync(request.id);

    if (!movement) {
      return err(new EntityNotFoundError(Movement));
    }

    movement.date = new Date(request.date);

    movement.amount = request.amount;

    movement.notes = request.notes;

    movement.memberId = request.memberId;

    movement.employeeId = request.employeeId;

    movement.professorId = request.professorId;

    await MovementsCollection.updateEntity(movement);

    this._logger.info('Movement updated', { movementId: request.id });

    return ok(null);
  }
}
