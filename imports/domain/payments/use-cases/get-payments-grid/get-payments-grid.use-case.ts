import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { IPaymentDuePort } from '@domain/payment-dues/payment-due.port';
import { Payment } from '@domain/payments/entities/payment.entity';
import { IPaymentPort } from '@domain/payments/payment.port';
import { GetPaymentsGridRequestDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.request.dto';
import { GetPaymentsGridResponseDto } from '@domain/payments/use-cases/get-payments-grid/get-payments-grid.response.dto';
import { PaymentGridDto } from '@domain/payments/use-cases/get-payments-grid/payment-grid.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { MoneyUtils } from '@shared/utils/money.utils';

@injectable()
export class GetPaymentsGridUseCase
  extends UseCase<GetPaymentsGridRequestDto>
  implements IUseCaseOld<GetPaymentsGridRequestDto, GetPaymentsGridResponseDto>
{
  public constructor(
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
    @inject(DIToken.PaymentDueRepository)
    private readonly _paymentDuePort: IPaymentDuePort,
    @inject(DIToken.MemberRepositoryOld)
    private readonly _memberPort: IMemberPort,
  ) {
    super();
  }

  public async execute(
    request: GetPaymentsGridRequestDto,
  ): Promise<Result<GetPaymentsGridResponseDto, Error>> {
    const { data, count, totalAmount } =
      await this._paymentPort.findPaginated(request);

    const members = await this._memberPort.findByIds(
      data.map((payment) => payment.memberId),
    );

    const paymentDues = await this._paymentDuePort.findByPayments(
      data.map((payment) => payment._id),
    );

    return ok<GetPaymentsGridResponseDto>({
      count,
      data: data.map((payment: Payment): PaymentGridDto => {
        const member = members.find((m) => m._id === payment.memberId);

        invariant(member);

        const paymentDuesForPayment = paymentDues.filter(
          (pd) => pd.paymentId === payment._id,
        );

        return {
          _id: payment._id,
          count: paymentDuesForPayment.length,
          date: payment.dateFormatted,
          dues: [],
          isDeleted: payment.isDeleted,
          memberId: payment.memberId,
          memberName: member.name,
          receiptNumber: payment.receiptNumber,
          totalAmount: '100',
        };
      }),
      totalAmount: MoneyUtils.formatCents(totalAmount),
    });
  }
}
