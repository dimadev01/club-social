import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class DeleteDueUseCase implements IUseCase<FindOneById, null> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(request: FindOneById): Promise<Result<null, Error>> {
    const due = await this._dueRepository.findOneByIdOrThrow(request);

    if (!due.isDeletable()) {
      return err(new Error('Due is not deletable'));
    }

    await this._dueRepository.delete(request);

    this._logger.info('Due deleted', { due: request.id });

    return ok(null);
  }
}
