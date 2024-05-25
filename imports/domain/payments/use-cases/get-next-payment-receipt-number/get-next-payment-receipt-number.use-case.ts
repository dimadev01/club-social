import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IPaymentPort } from '@domain/payments/payment.port';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import type { GetNextPaymentReceiptNumberResponseDto } from './get-next-payment-receipt-number-response.dto';

@injectable()
export class GetNextPaymentReceiptNumberUseCase
  extends UseCase
  implements IUseCase<null, GetNextPaymentReceiptNumberResponseDto>
{
  public constructor(
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
  ) {
    super();
  }

  public async execute(): Promise<
    Result<GetNextPaymentReceiptNumberResponseDto, Error>
  > {
    const response = await this._paymentPort.findLastByReceiptNumber();

    if (!response) {
      return ok({ receiptNumber: 1 });
    }

    return ok({ receiptNumber: (response.receiptNumber ?? 0) + 1 });
  }
}
