import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IEmailRepository } from '@application/notifications/emails/email.repository';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel } from '@domain/dues/due.enum';
import { IDueRepository } from '@domain/dues/due.repository';
import { IMemberRepository } from '@domain/members/member.repository';

@injectable()
export class SendNewDueEmailUseCase implements IUseCase<FindOneById, null> {
  constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IEmailRepository)
    private readonly _emailRepository: IEmailRepository,
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

    const result = await this._emailRepository.sendTemplate({
      templateId: `d-523b01d111fe4a3798b80d9dc7a4a2f7`,
      to: {
        email: member.firstEmail(),
        name: member.name,
      },
      unsubscribeGroupId: 237800,
      variables: {
        amount: due.amount.formatWithCurrency(),
        category: DueCategoryLabel[due.category].toLowerCase(),
        date: due.date.format(),
        memberName: member.firstName,
        pendingElectricity: new Money({
          amount: memberTotals.pendingElectricity,
        }).formatWithCurrency(),
        pendingGuest: new Money({
          amount: memberTotals.pendingGuest,
        }).formatWithCurrency(),
        pendingMembership: new Money({
          amount: memberTotals.pendingMembership,
        }).formatWithCurrency(),
        pendingTotal: new Money({
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
