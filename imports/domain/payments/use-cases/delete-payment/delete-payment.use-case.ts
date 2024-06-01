import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases-old/use-case.interface';
import { ILogger } from '@domain/common/logger/logger.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IPaymentPort } from '@domain/payments/payment.port';
import { DeletePaymentRequestDto } from '@domain/payments/use-cases/delete-payment/delete-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class DeletePaymentUseCase
  extends UseCaseOld<DeletePaymentRequestDto>
  implements IUseCaseOld<DeletePaymentRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
  ) {
    super();
  }

  public async execute(
    request: DeletePaymentRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.PAYMENTS, PermissionEnum.DELETE);

    const payment = await this._paymentPort.findOneByIdOrThrow(request.id);

    await this._paymentPort.delete(payment);

    this._logger.info('Payment deleted', { payment: payment._id });

    return ok(null);
  }
}
