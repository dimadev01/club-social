import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DueDto } from '@application/dues/dtos/due.dto';
import { CreateDueRequest } from '@application/dues/use-cases/create-due/create-due.request';
import { GetDueUseCase } from '@application/dues/use-cases/get-due/get-due.use-case';
import { IEmailService } from '@application/notifications/emails/email-service.interface';
import { ErrorUtils } from '@domain/common/errors/error.utils';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel } from '@domain/dues/due.enum';
import { IDueRepository } from '@domain/dues/due.repository';
import { Due } from '@domain/dues/models/due.model';
import { IMemberRepository } from '@domain/members/member.repository';

@injectable()
export class CreateDueUseCase implements IUseCase<CreateDueRequest, DueDto[]> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IEmailService)
    private readonly _emailService: IEmailService,
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

      const members = await this._memberRepository.findByIds({
        ids: request.memberIds,
      });

      const membersWithEmails = members.filter((member) => member.hasEmail());

      await Promise.all(
        membersWithEmails.map(async (member) => {
          const due = newDues.find((d) => d.memberId === member._id);

          invariant(due);

          await this._emailService.sendTemplate({
            templateId: 'd-523b01d111fe4a3798b80d9dc7a4a2f7',
            to: {
              email: member.firstEmail(),
              name: member.name,
            },
            unsubscribeGroupId: 237800,
            variables: {
              amount: due.amount.formatWithCurrency(),
              category: DueCategoryLabel[due.category],
              date: due.date.format(),
              memberName: member.name,
            },
          });
        }),
      );

      const getDuesResult = await Promise.all(
        newDues.map(async (due) =>
          this._getDueUseCase.execute({ id: due._id }),
        ),
      );

      const getDuesResultCombined = Result.combine(getDuesResult);

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
