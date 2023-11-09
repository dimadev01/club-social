import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { MovementNotFoundError } from '@domain/movements/errors/movement-not-found.error';
import { MovementCollection } from '@domain/movements/movement.collection';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class RestoreMovementUseCase
  extends UseCase<RestoreMovementRequestDto>
  implements IUseCase<RestoreMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger
  ) {
    super();
  }

  public async execute(
    request: RestoreMovementRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Update);

    await this.validateDto(RestoreMovementRequestDto, request);

    const movement = await MovementCollection.findOneAsync(request.id);

    if (!movement) {
      return err(new MovementNotFoundError());
    }

    movement.isDeleted = false;

    await MovementCollection.updateEntity(movement);

    this._logger.info('Movement restored', { movement: movement._id });

    return ok(null);
  }
}
