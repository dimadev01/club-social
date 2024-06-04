import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetPaymentRequest } from '@application/payments/use-cases/get-payment/get-payment.request';
import { GetPaymentResponse } from '@application/payments/use-cases/get-payment/get-payment.response';
import { FindOneModelById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/payment.repository';

@injectable()
export class GetPaymentUseCase
  implements IUseCase<GetPaymentRequest, GetPaymentResponse>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindOneModelById,
  ): Promise<Result<GetPaymentResponse, Error>> {
    const payment = await this._paymentRepository.findOneById({
      fetchMember: true,
      fetchPaymentDues: true,
      fetchPaymentDuesDue: true,
      id: request.id,
    });

    return ok(payment);
  }
}
