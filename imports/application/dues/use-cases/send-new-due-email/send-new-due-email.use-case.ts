import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { IDueRepository } from '@application/dues/repositories/due.repository';
import { IMemberRepository } from '@application/members/repositories/member.repository';
import { IEmailService } from '@application/notifications/emails/email-service.interface';
import { EmailVo } from '@domain/common/value-objects/email.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel } from '@domain/dues/due.enum';

@injectable()
export class SendNewDueEmailUseCase implements IUseCase<FindOneById, null> {
  constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IEmailService)
    private readonly _emailRepository: IEmailService,
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(request: FindOneById): Promise<Result<null, Error>> {
    const due = await this._dueRepository.findOneByIdOrThrow(request);

    const member = await this._memberRepository.findOneByIdOrThrow({
      id: due.memberId,
    });

    if (!member.hasEmail()) {
      return ok(null);
    }

    const [memberTotals] = await this._memberRepository.findToExport({
      filterByCategory: [],
      filterByDebtStatus: [],
      filterById: [member._id],
      filterByStatus: [],
      limit: 1,
      page: 1,
      sorter: { _id: 'ascend' },
    });

    const result = await this._emailRepository.sendNewDue({
      to: {
        email: EmailVo.from({ address: member.firstEmail() }),
        name: member.name,
      },
      variables: {
        amount: due.amount.formatWithCurrency(),
        category: DueCategoryLabel[due.category].toLowerCase(),
        date: due.date.format(),
        memberName: member.firstName,
        pendingElectricity: Money.from({
          amount: memberTotals.pendingElectricity,
        }).formatWithCurrency(),
        pendingGuest: Money.from({
          amount: memberTotals.pendingGuest,
        }).formatWithCurrency(),
        pendingMembership: Money.from({
          amount: memberTotals.pendingMembership,
        }).formatWithCurrency(),
        pendingTotal: Money.from({
          amount: memberTotals.pendingTotal,
        }).formatWithCurrency(),
      },
    });

    if (result.isErr()) {
      this._logger.error(result.error, { due, member });
    }

    return ok(null);
  }
}
