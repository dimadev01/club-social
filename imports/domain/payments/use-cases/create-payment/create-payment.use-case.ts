import { err, ok, Result } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IDuePort } from '@domain/dues/due.port';
import { IMemberPort } from '@domain/members/member.port';
import { PaymentDue } from '@domain/payments/entities/payment-due';
import { PaymentDueDue } from '@domain/payments/entities/payment-due-due';
import { PaymentMember } from '@domain/payments/entities/payment-member';
import { Payment } from '@domain/payments/entities/payment.entity';
import { IPaymentPort } from '@domain/payments/payment.port';
import { CreatePaymentRequestDto } from '@domain/payments/use-cases/create-payment/create-payment-request.dto';
import { DuePaidError } from '@domain/payments/use-cases/create-payment/errors/due-paid.error';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { ErrorUtils } from '@shared/utils/error.utils';
import { MongoUtils } from '@shared/utils/mongo.utils';
import { CreatePaymentResponseDto } from './create-payment-response.dto';
import { ExistingPaymentError } from './errors/existing-payment.error';

@injectable()
export class CreatePaymentUseCase
  extends UseCase<CreatePaymentRequestDto>
  implements IUseCase<CreatePaymentRequestDto, CreatePaymentResponseDto>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePort
  ) {
    super();
  }

  public async execute(
    request: CreatePaymentRequestDto
  ): Promise<Result<CreatePaymentResponseDto, Error>> {
    await this.validatePermission(ScopeEnum.Payments, PermissionEnum.Create);

    const existingPaymentByReceipt =
      await this._paymentPort.findOneByReceiptNumber({
        receiptNumber: request.receiptNumber,
      });

    if (existingPaymentByReceipt) {
      return err(
        new ExistingPaymentError(
          `Ya existe un pago con el Recibo número ${request.receiptNumber}`
        )
      );
    }

    const session = MongoUtils.startSession();

    try {
      let payment: Payment | undefined;

      await session.withTransaction(async () => {
        const dues = await this._duePort.findByIds({
          dueIds: request.dues.map((d) => d.dueId),
        });

        dues.forEach((due) => {
          if (due.isPaid()) {
            throw new DuePaidError(due._id);
          }
        });

        const member = await this._memberPort.findOneByIdOrThrow(
          request.memberId
        );

        const newPaymentMember = PaymentMember.create({
          memberId: request.memberId,
          name: member.name,
        });

        if (newPaymentMember.isErr()) {
          throw newPaymentMember.error;
        }

        const paymentDuesResults = request.dues.map((requestDue) => {
          const due = dues.find((d) => d._id === requestDue.dueId);

          invariant(due);

          const newPaymentDueDue = PaymentDueDue.create({
            amount: due.amount,
            category: due.category,
            date: due.date,
            dueId: due._id,
          });

          if (newPaymentDueDue.isErr()) {
            throw newPaymentDueDue.error;
          }

          return PaymentDue.create({
            amount: requestDue.amount,
            due: newPaymentDueDue.value,
          });
        });

        const paymentDues = Result.combine(paymentDuesResults);

        if (paymentDues.isErr()) {
          throw paymentDues.error;
        }

        const newPaymentResult = Payment.create({
          date: request.date,
          dues: paymentDues.value,
          member: newPaymentMember.value,
          notes: request.notes,
          receiptNumber: request.receiptNumber,
        });

        if (newPaymentResult.isErr()) {
          throw newPaymentResult.error;
        }

        payment = newPaymentResult.value;

        await Promise.all(
          dues.map(async (due) => {
            const requestDue = request.dues.find((d) => d.dueId === due._id);

            invariant(requestDue);

            const result = due.pay({
              _id: newPaymentResult.value._id,
              amount: requestDue.amount,
              date: newPaymentResult.value.date,
            });

            if (result.isErr()) {
              throw result.error;
            }

            await this._duePort.updateWithSession(due, session);
          })
        );

        await this._paymentPort.createWithSession(
          newPaymentResult.value,
          session
        );
      });

      invariant(payment);

      return ok({ id: payment._id });
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await session.endSession();
    }
  }
}
