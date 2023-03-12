import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MovementNotFoundError } from '@domain/movements/errors/movement-not-found.error';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class DeleteMovementUseCase
  extends UseCase<DeleteMovementRequestDto>
  implements IUseCase<DeleteMovementRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: DeleteMovementRequestDto
  ): Promise<Result<undefined, Error>> {
    this.validatePermission(Scope.Movements, Permission.Delete);

    await this.validateDto(DeleteMovementRequestDto, request);

    const movement = await MovementsCollection.findOne(request.id);

    if (!movement) {
      return err(new MovementNotFoundError());
    }

    movement.isDeleted = true;

    await MovementsCollection.updateEntity(movement);

    this._logger.info('Movement deleted', { movement: movement._id });

    return ok(undefined);
  }
}
