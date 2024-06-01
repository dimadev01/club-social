import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import type { GetNextPaymentReceiptNumberResponseDto } from './get-next-payment-receipt-number-response.dto';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IPaymentPort } from '@domain/payments/payment.port';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetNextPaymentReceiptNumberUseCase
  extends UseCase
  implements IUseCaseOld<null, GetNextPaymentReceiptNumberResponseDto>
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
