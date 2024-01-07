import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { DeleteDueRequestDto } from '@domain/dues/use-cases/delete-due/delete-due-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class DeleteDueUseCase
  extends UseCase<DeleteDueRequestDto>
  implements IUseCase<DeleteDueRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort
  ) {
    super();
  }

  public async execute(
    request: DeleteDueRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Dues, PermissionEnum.Delete);

    const due = await this._duePort.findOneByIdOrThrow(request.id);

    await this._duePort.delete(due);

    this._logger.info('Due deleted', { due: due._id });

    return ok(null);
  }
}
