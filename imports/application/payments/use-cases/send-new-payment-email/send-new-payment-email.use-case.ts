import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { ILoggerService } from '@application/common/logger/logger.interface';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { IEmailRepository } from '@application/emails/repositories/email.repository';
import { IMemberRepository } from '@application/members/repositories/member.repository';
import { IEmailService } from '@application/notifications/emails/email-service.interface';
import { EmailServiceEnum } from '@application/notifications/emails/email.enum';
import { IPaymentRepository } from '@application/payments/repositories/payment.repository';
import { EmailVo } from '@domain/common/value-objects/email.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueCategoryLabel } from '@domain/dues/due.enum';
import { Email } from '@domain/emails/models/email.model';

@injectable()
export class SendNewPaymentEmailUseCase implements IUseCase<FindOneById, null> {
  constructor(
    @inject(DIToken.ILoggerService)
    private readonly _logger: ILoggerService,
    @inject(DIToken.IEmailService)
    private readonly _emailService: IEmailService,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(DIToken.IEmailRepository)
    private readonly _emailRepository: IEmailRepository,
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

    const email = Email.create({
      from: {
        email: EmailVo.from({ address: EmailServiceEnum.EMAIL_FROM_ADDRESS }),
        name: EmailServiceEnum.EMAIL_FORM_NAME,
      },
      templateId: 'd-229024941d0447aeb80c945adaf7169b',
      to: {
        email: EmailVo.from({ address: member.firstEmail() }),
        name: member.name,
      },
      unsubscribeGroupID: '237801',
      variables: {
        amount: payment.amount.formatWithCurrency(),
        date: payment.date.format(),
        dues: payment.dues.map((paymentDue) => ({
          dueAmount: paymentDue.dueAmount.formatWithCurrency(),
          dueCategory: DueCategoryLabel[paymentDue.dueCategory].toLowerCase(),
          dueDate: paymentDue.dueDate.format(),
        })),
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

    if (email.isErr()) {
      return err(email.error);
    }

    await this._emailRepository.insert(email.value);

    this._emailService
      .sendNewPayment({ id: email.value._id })
      .then(async (result) => {
        if (result.isErr()) {
          this._logger.error(result.error, { member, payment });
        } else {
          email.value.markSent();

          await this._emailRepository.update(email.value);
        }
      });

    return ok(null);
  }
}
