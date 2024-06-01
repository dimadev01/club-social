import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { PaymentModelDto } from '@application/payments/dtos/payment-model.dto';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { DIToken } from '@domain/common/tokens.di';
import { IModelUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class GetPaymentUseCase
  implements IModelUseCase<PaymentModelDto | null>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindOneModelByIdRequest,
  ): Promise<Result<PaymentModelDto | null, Error>> {
    const payment = await this._paymentRepository.findOneById(request);

    if (!payment) {
      return err(new ModelNotFoundError());
    }

    return ok<PaymentModelDto>({
      date: payment.date.toISOString(),
      id: payment._id,
      memberId: payment.memberId,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
    });
  }
}
