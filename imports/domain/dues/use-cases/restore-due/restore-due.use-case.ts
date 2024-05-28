import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { RestoreDueRequestDto } from '@domain/dues/use-cases/restore-due/restore-due-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class RestoreDueUseCase
  extends UseCase<RestoreDueRequestDto>
  implements IUseCaseOld<RestoreDueRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: RestoreDueRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.DUES, PermissionEnum.UPDATE);

    const due = await this._duePort.findOneByIdOrThrow(request.id);

    due.restore();

    await this._duePort.update(due);

    this._logger.info('Due restored', { due: due._id });

    return ok(null);
  }
}
