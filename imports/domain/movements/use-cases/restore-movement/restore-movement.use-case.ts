import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { IMovementPort } from '@domain/movements/movement.port';
import { RestoreMovementRequestDto } from '@domain/movements/use-cases/restore-movement/restore-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class RestoreMovementUseCase
  extends UseCase<RestoreMovementRequestDto>
  implements IUseCaseOld<RestoreMovementRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.MovementRepository)
    private readonly _movementPort: IMovementPort,
  ) {
    super();
  }

  public async execute(
    request: RestoreMovementRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.MOVEMENTS, PermissionEnum.UPDATE);

    const movement = await this._movementPort.findOneByIdOrThrow(request.id);

    movement.restore();

    await this._movementPort.update(movement);

    this._logger.info('Movement restored', { movement: movement._id });

    return ok(null);
  }
}
