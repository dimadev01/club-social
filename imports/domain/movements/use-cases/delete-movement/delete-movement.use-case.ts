import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IMovementPort } from '@domain/movements/movement.port';
import { DeleteMovementRequestDto } from '@domain/movements/use-cases/delete-movement/delete-movement-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class DeleteMovementUseCase
  extends UseCase<DeleteMovementRequestDto>
  implements IUseCase<DeleteMovementRequestDto, null>
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
    request: DeleteMovementRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.MOVEMENTS, PermissionEnum.DELETE);

    const movement = await this._movementPort.findOneByIdOrThrow(request.id);

    await this._movementPort.delete(movement);

    this._logger.info('Movement deleted', { movement: movement._id });

    return ok(null);
  }
}
