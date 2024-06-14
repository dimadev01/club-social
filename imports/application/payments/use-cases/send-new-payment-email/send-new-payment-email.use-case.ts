import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IEmailRepository } from '@application/notifications/emails/email.repository';
import { ILogger } from '@domain/common/logger/logger.interface';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel } from '@domain/dues/due.enum';
import { IMemberRepository } from '@domain/members/member.repository';
import { IPaymentRepository } from '@domain/payments/payment.repository';

@injectable()
export class SendNewPaymentEmailUseCase implements IUseCase<FindOneById, null> {
  constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IEmailRepository)
    private readonly _emailRepository: IEmailRepository,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(request: FindOneById): Promise<Result<null, Error>> {
    const payment = await this._paymentRepository.findOneByIdOrThrow(request);

    const member = await this._memberRepository.findOneByIdOrThrow({
      id: payment.memberId,
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
      templateId: `d-229024941d0447aeb80c945adaf7169b`,
      to: {
        email: member.firstEmail(),
        name: member.name,
      },
      unsubscribeGroupId: 237801,
      variables: {
        amount: payment.amount.formatWithCurrency(),
        date: payment.date.format(),
        dues: payment.dues.map((paymentDue) => ({
          dueAmount: paymentDue.dueAmount.formatWithCurrency(),
          dueCategory: DueCategoryLabel[paymentDue.dueCategory].toLowerCase(),
          dueDate: paymentDue.dueDate.format(),
        })),
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
      this._logger.error(result.error, { member, payment });
    }

    return ok(null);
  }
}
