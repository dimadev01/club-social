import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MovementNotFoundError } from '@domain/movements/errors/movement-not-found.error';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class RestoreMovementUseCase
  extends UseCase<RestoreMovementRequestDto>
  implements IUseCase<RestoreMovementRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: RestoreMovementRequestDto
  ): Promise<Result<undefined, Error>> {
    this.validatePermission(Scope.Movements, Permission.Update);

    await this.validateDto(RestoreMovementRequestDto, request);

    const movement = await MovementsCollection.findOneAsync(request.id);

    if (!movement) {
      return err(new MovementNotFoundError());
    }

    movement.isDeleted = false;

    await MovementsCollection.updateEntity(movement);

    this._logger.info('Movement restored', { movement: movement._id });

    return ok(undefined);
  }
}
