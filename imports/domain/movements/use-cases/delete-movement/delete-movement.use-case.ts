import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { MovementNotFoundError } from '@domain/movements/errors/movement-not-found.error';
import { MovementsCollection } from '@domain/movements/movements.collection';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { Permission, Scope } from '@domain/roles/roles.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class DeleteMovementUseCase
  extends UseCase<DeleteMovementRequestDto>
  implements IUseCase<DeleteMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: DeleteMovementRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(Scope.Movements, Permission.Delete);

    await this.validateDto(DeleteMovementRequestDto, request);

    const movement = await MovementsCollection.findOneAsync(request.id);

    if (!movement) {
      return err(new MovementNotFoundError());
    }

    movement.isDeleted = true;

    await MovementsCollection.updateEntity(movement);

    this._logger.info('Movement deleted', { movement: movement._id });

    return ok(null);
  }
}
