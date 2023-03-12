import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MovementNotFoundError } from '@domain/movements/errors/movement-not-found.error';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { UpdateMovementRequestDto } from '@domain/movements/use-cases/update-movement/update-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class UpdateMovementUseCase
  extends UseCase<UpdateMovementRequestDto>
  implements IUseCase<UpdateMovementRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: UpdateMovementRequestDto
  ): Promise<Result<undefined, Error>> {
    this.validatePermission(Scope.Movements, Permission.Create);

    await this.validateDto(UpdateMovementRequestDto, request);

    const movement = await MovementsCollection.findOneAsync(request.id);

    if (!movement) {
      return err(new MovementNotFoundError());
    }

    movement.date = new Date(request.date);

    movement.amount = request.amount;

    movement.notes = request.notes;

    movement.memberId = request.memberId;

    movement.employeeId = request.employeeId;

    movement.rentalId = request.rentalId;

    movement.professorId = request.professorId;

    await MovementsCollection.updateEntity(movement);

    this._logger.info('Movement updated', { movementId: request.id });

    return ok(undefined);
  }
}
