import { err, ok, Result } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { PaymentDue } from '@domain/payments/entities/payment-due';
import { PaymentDueDue } from '@domain/payments/entities/payment-due-due';
import { IPaymentPort } from '@domain/payments/payment.port';
import { UpdatePaymentRequestDto } from '@domain/payments/use-cases/update-payment/update-payment-request.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { DateUtils } from '@shared/utils/date.utils';

@injectable()
export class UpdatePaymentUseCase
  extends UseCase<UpdatePaymentRequestDto>
  implements IUseCase<UpdatePaymentRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort
  ) {
    super();
  }

  public async execute(
    request: UpdatePaymentRequestDto
  ): Promise<Result<null, Error>> {
    await this.validatePermission(ScopeEnum.Payments, PermissionEnum.Update);

    const payment = await this._paymentPort.findOneByIdOrThrow(request.id);

    if (payment.dues.length !== request.dues.length) {
      const duesToVoid = payment.dues.filter(
        (d) => !request.dues.some((f) => f.dueId === d.due._id)
      );

      await Promise.all(
        duesToVoid.map(async (d) => {
          const due = await this._duePort.findOneByIdOrThrow(d.due._id);

          due.pending();

          await this._duePort.update(due);
        })
      );
    }

    const paymentDuesResults = await Promise.all(
      request.dues.map(async (dueRequest) => {
        const due = await this._duePort.findOneByIdOrThrow(dueRequest.dueId);

        invariant(due);

        const paymentDueDue = PaymentDueDue.create({
          amount: due.amount,
          category: due.category,
          date: due.date,
          dueId: due._id,
        });

        if (paymentDueDue.isErr()) {
          throw paymentDueDue.error;
        }

        return PaymentDue.create({
          amount: dueRequest.amount,
          due: paymentDueDue.value,
        });
      })
    );

    const paymentDues = Result.combine(paymentDuesResults);

    if (paymentDues.isErr()) {
      return err(paymentDues.error);
    }

    const updatePayment: Result<null[], Error> = Result.combine([
      payment.setNotes(request.notes),
      payment.setDues(paymentDues.value),
      payment.setDate(DateUtils.utc(request.date).toDate()),
    ]);

    if (updatePayment.isErr()) {
      return err(updatePayment.error);
    }

    await this._paymentPort.update(payment);

    this._logger.info('Payment updated', { paymentId: request.id });

    return ok(null);
  }
}
