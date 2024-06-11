import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { VoidDueRequest } from '@application/dues/use-cases/void-due/void-due.request';
import { BaseError } from '@domain/common/errors/base.error';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';
import { DueNotVoidableError } from '@domain/dues/errors/due-not-voidable.error';

@injectable()
export class VoidDueUseCase implements IUseCase<VoidDueRequest, null> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
  ) {}

  public async execute(request: VoidDueRequest): Promise<Result<null, Error>> {
    this._unitOfWork.start();

    try {
      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const due = await this._dueRepository.findOneByIdOrThrow(request);

        if (!due.isVoidable()) {
          throw new DueNotVoidableError();
        }

        const voidResult = due.void(request.voidedBy, request.voidReason);

        if (voidResult.isErr()) {
          throw voidResult.error;
        }

        await this._dueRepository.updateWithSession(due, unitOfWork);
      });

      this._logger.info('Due voided', { due: request.id });

      return ok(null);
    } catch (error) {
      if (error instanceof BaseError) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
