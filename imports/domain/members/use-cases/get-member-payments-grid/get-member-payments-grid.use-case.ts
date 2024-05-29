import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { GetMemberPaymentsGridRequestDto } from './get-member-payments-grid.request.dto';
import { GetMemberPaymentsGridResponseDto } from './get-member-payments-grid.response.dto';
import { MemberPaymentGridDto } from './member-payment-grid.dto';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IMemberPort } from '@domain/members/member.port';
import { Payment } from '@domain/payments/entities/payment.entity';
import { IPaymentPort } from '@domain/payments/payment.port';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/money.utils';

@injectable()
export class GetMemberPaymentsGridUseCase
  extends UseCase<GetMemberPaymentsGridRequestDto>
  implements
    IUseCaseOld<
      GetMemberPaymentsGridRequestDto,
      GetMemberPaymentsGridResponseDto
    >
{
  public constructor(
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
    @inject(DIToken.MemberRepositoryOld)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(
    request: GetMemberPaymentsGridRequestDto,
  ): Promise<Result<GetMemberPaymentsGridResponseDto, Error>> {
    const loggedInMember = await this._memberPort.getLoggedInOrThrow();

    const { data, count, totalAmount } = await this._paymentPort.findPaginated({
      ...request,
      memberIds: [loggedInMember._id],
      showDeleted: false,
    });

    return ok<GetMemberPaymentsGridResponseDto>({
      count,
      data: data.map(
        (payment: Payment): MemberPaymentGridDto => ({
          _id: payment._id,
          count: payment.duesCount,
          date: payment.dateFormatted,
          dues: payment.dues.map((paymentDue) => ({
            dueAmount: paymentDue.due.amountFormatted,
            dueCategory: paymentDue.due.category,
            dueDate: paymentDue.due.dateFormatted,
            dueId: paymentDue.due._id,
            membershipMonth: paymentDue.due.membershipMonth,
            paymentAmount: paymentDue.amountFormatted,
          })),
          isDeleted: payment.isDeleted,
          totalAmount: payment.totalDuesPaidAmountFormatted,
        }),
      ),
      totalAmount: MoneyUtils.formatCents(totalAmount),
    });
  }
}
