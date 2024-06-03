import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DeleteDueRequest } from '@application/dues/use-cases/delete-due/delete-due.request';
import { DeleteDueResponse } from '@application/dues/use-cases/delete-due/delete-due.response';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class DeleteDueUseCase
  implements IUseCase<DeleteDueRequest, DeleteDueResponse>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: DeleteDueRequest,
  ): Promise<Result<DeleteDueResponse, Error>> {
    await this._dueRepository.delete(request);

    this._logger.info('Due deleted', { due: request.id });

    return ok(null);
  }
}
