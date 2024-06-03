import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetPaymentRequest } from '@application/payments/use-cases/get-payment/get-payment.request';
import { GetPaymentResponse } from '@application/payments/use-cases/get-payment/get-payment.response';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class GetPaymentUseCase
  implements IUseCase<GetPaymentRequest, GetPaymentResponse | null>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindOneModelByIdRequest,
  ): Promise<Result<GetPaymentResponse | null, Error>> {
    const payment = await this._paymentRepository.findOneById(request);

    if (!payment) {
      return err(new ModelNotFoundError());
    }

    return ok<GetPaymentResponse>({
      date: payment.date.toISOString(),
      dues: [],
      id: payment._id,
      memberId: payment.memberId,
      memberName: payment._id,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
    });
  }
}
