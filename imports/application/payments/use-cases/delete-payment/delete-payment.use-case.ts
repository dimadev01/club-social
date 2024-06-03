import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { DeletePaymentRequest } from '@application/payments/use-cases/delete-payment/delete-payment.request';
import { DeletePaymentResponse } from '@application/payments/use-cases/delete-payment/delete-payment.response';
import { ILogger } from '@domain/common/logger/logger.interface';
import { IUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class DeletePaymentUseCase
  implements IUseCase<DeletePaymentRequest, DeletePaymentResponse>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: DeletePaymentRequest,
  ): Promise<Result<DeletePaymentResponse, Error>> {
    await this._paymentRepository.delete(request);

    this._logger.info('Payment deleted', { payment: request.id });

    return ok(null);
  }
}
