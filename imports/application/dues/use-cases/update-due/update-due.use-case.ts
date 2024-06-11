import { Result, err } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueDto } from '@application/dues/dtos/due.dto';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { UpdateDueRequest } from '@application/dues/use-cases/update-due/update-due.request';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { ModelNotUpdatableError } from '@domain/common/errors/model-not-updatable.error';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { Money } from '@domain/common/value-objects/money.value-object';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class UpdateDueUseCase implements IUseCase<UpdateDueRequest, DueDto> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    private readonly _getDueUseCase: GetDueUseCase,
  ) {}

  public async execute(
    request: UpdateDueRequest,
  ): Promise<Result<DueDto, Error>> {
    const due = await this._dueRepository.findOneByIdOrThrow({
      id: request.id,
    });

    if (!due.isUpdatable()) {
      return err(new ModelNotUpdatableError());
    }

    try {
      this._unitOfWork.start();

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        due.setAmount(new Money({ amount: request.amount }));

        due.setNotes(request.notes);

        await this._dueRepository.updateWithSession(due, unitOfWork);
      });

      return await this._getDueUseCase.execute({ id: due._id });
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await this._unitOfWork.end();
    }
  }
}
