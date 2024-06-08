import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueDto } from '@application/dues/dtos/due.dto';
import { CreateDueRequest } from '@application/dues/use-cases/create-due/create-due.request';
import { GetDuesByIdsUseCase } from '@application/dues/use-cases/get-dues-by-ids/get-dues-by-ids.use-case';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { IDueRepository } from '@domain/dues/due.repository';
import { Due } from '@domain/dues/models/due.model';
import { ErrorUtils } from '@shared/utils/error.utils';

@injectable()
export class CreateDueUseCase implements IUseCase<CreateDueRequest, DueDto[]> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    private readonly _getDuesByIdsUseCase: GetDuesByIdsUseCase,
  ) {}

  public async execute(
    request: CreateDueRequest,
  ): Promise<Result<DueDto[], Error>> {
    try {
      this._unitOfWork.start();

      const newDues: Due[] = [];

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        await Promise.all(
          request.memberIds.map(async (memberId: string) => {
            const due = Due.createOne({
              amount: new Money({ amount: request.amount }),
              category: request.category,
              date: new DateUtcVo(request.date),
              memberId,
              notes: request.notes,
            });

            if (due.isErr()) {
              throw due.error;
            }

            await this._dueRepository.insertWithSession(due.value, unitOfWork);

            newDues.push(due.value);
          }),
        );
      });

      const duesDtos = await this._getDuesByIdsUseCase.execute({
        ids: newDues.map((due) => due._id),
      });

      if (duesDtos.isErr()) {
        return err(duesDtos.error);
      }

      return ok(duesDtos.value);
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await this._unitOfWork.end();
    }
  }
}
