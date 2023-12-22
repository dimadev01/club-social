import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { UpdateDueRequestDto } from '@domain/dues/use-cases/update-due/update-due-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { DateUtils } from '@shared/utils/date.utils';

@injectable()
export class UpdateDueUseCase
  extends UseCase<UpdateDueRequestDto>
  implements IUseCase<UpdateDueRequestDto, null>
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
    request: UpdateDueRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Movements, PermissionEnum.Update);

    const due = await this._duePort.findOneByIdOrThrow(request.id);

    const updateDueResult: Result<null[], Error> = Result.combine([
      due.setAmount(request.amount),
      due.setNotes(request.notes),
      due.setCategory(request.category),
      due.setDate(DateUtils.utc(request.date).toDate()),
    ]);

    if (updateDueResult.isErr()) {
      return err(updateDueResult.error);
    }

    await this._duePort.update(due);

    this._logger.info('Due updated', { dueId: request.id });

    return ok(null);
  }
}
