import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IPaymentPort } from '@domain/payments/payment.port';
import { RestorePaymentRequestDto } from '@domain/payments/use-cases/restore-payment/restore-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class RestorePaymentUseCase
  extends UseCase<RestorePaymentRequestDto>
  implements IUseCase<RestorePaymentRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort
  ) {
    super();
  }

  public async execute(
    request: RestorePaymentRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Payments, PermissionEnum.Update);

    const payment = await this._paymentPort.findOneByIdOrThrow(request.id);

    payment.restore();

    await this._paymentPort.update(payment);

    this._logger.info('Payment restored', { payment: payment._id });

    return ok(null);
  }
}
