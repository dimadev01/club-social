import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { IPaymentPort } from '@domain/payments/payment.port';
import { DeletePaymentRequestDto } from '@domain/payments/use-cases/delete-payment/delete-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class DeletePaymentUseCase
  extends UseCase<DeletePaymentRequestDto>
  implements IUseCase<DeletePaymentRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort,
  ) {
    super();
  }

  public async execute(
    request: DeletePaymentRequestDto,
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Payments, PermissionEnum.Delete);

    const payment = await this._paymentPort.findOneByIdOrThrow(request.id);

    await Promise.all(
      payment.dues.map(async (paymentDue) => {
        const due = await this._duePort.findOneByIdOrThrow(paymentDue.due._id);

        due.removePayment(payment._id);

        await this._duePort.update(due);
      }),
    );

    await this._paymentPort.delete(payment);

    this._logger.info('Payment deleted', { payment: payment._id });

    return ok(null);
  }
}
