import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerRepository } from '@application/common/logger/logger.interface';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { DueDto } from '@application/dues/dtos/due.dto';
import { IDueRepository } from '@application/dues/repositories/due.repository';
import { CreateDueRequest } from '@application/dues/use-cases/create-due/create-due.request';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { SendNewDueEmailUseCase } from '@application/dues/use-cases/send-new-due-email/send-new-due-email.use-case';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { Due } from '@domain/dues/models/due.model';

@injectable()
export class CreateDueUseCase implements IUseCase<CreateDueRequest, DueDto[]> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILoggerRepository,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    private readonly _sendNewDueEmail: SendNewDueEmailUseCase,
    private readonly _getDueUseCase: GetDueUseCase,
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
              date: new DateVo(request.date),
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

      newDues.forEach((newDue) =>
        this._sendNewDueEmail.execute({ id: newDue._id }),
      );

      const duesDtos = await Promise.all(
        newDues.map(async (due) =>
          this._getDueUseCase.execute({ id: due._id }),
        ),
      );

      const getDuesResultCombined = Result.combine(duesDtos);

      if (getDuesResultCombined.isErr()) {
        return err(getDuesResultCombined.error);
      }

      return ok(getDuesResultCombined.value);
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await this._unitOfWork.end();
    }
  }
}
