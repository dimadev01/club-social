import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@domain/common/logger/logger.interface';
import { FindOneModelByIdRequest } from '@domain/common/repositories/queryable.repository';
import { DIToken } from '@domain/common/tokens.di';
import { IModelUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class DeletePaymentUseCase implements IModelUseCase<null> {
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindOneModelByIdRequest,
  ): Promise<Result<null, Error>> {
    await this._paymentRepository.delete(request);

    this._logger.info('Payment deleted', { payment: request.id });

    return ok(null);
  }
}
