import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
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
  implements IUseCase<GetPaymentsGridRequestDto, GetPaymentsGridResponseDto>
{
  public constructor(
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
  ) {
    super();
  }

  public async execute(
    request: GetPaymentsGridRequestDto,
  ): Promise<Result<GetPaymentsGridResponseDto, Error>> {
    const { data, count, totalAmount } =
      await this._paymentPort.findPaginated(request);

    return ok<GetPaymentsGridResponseDto>({
      count,
      data: data.map(
        (payment: Payment): PaymentGridDto => ({
          _id: payment._id,
          count: 0,
          date: payment.dateFormatted,
          dues: [],
          isDeleted: payment.isDeleted,
          memberId: payment.memberId,
          memberName: '',
          receiptNumber: payment.receiptNumber,
          totalAmount: '100',
        }),
      ),
      totalAmount: MoneyUtils.formatCents(totalAmount),
    });
  }
}
