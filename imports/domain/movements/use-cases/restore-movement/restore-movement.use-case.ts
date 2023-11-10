import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
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
    private readonly _logger: ILogger,
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort
  ) {
    super();
  }

  public async execute(
    request: RestoreMovementRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Update);

    const movement = await this._movementPort.findOneByIdOrThrow(request.id);

    const restoreResult = movement.restore();

    if (restoreResult.isErr()) {
      return err(restoreResult.error);
    }

    await this._movementPort.update(movement);

    this._logger.info('Movement restored', { movement: movement._id });

    return ok(null);
  }
}
