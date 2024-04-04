import { err, ok, Result } from 'neverthrow';
import invariant from 'ts-invariant';
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

    const session = MongoUtils.startSession();

    const existingPaymentByReceipt =
      await this._paymentPort.findOneByReceiptNumber({
        receiptNumber: request.receiptNumber,
      });

    if (existingPaymentByReceipt) {
      return err(
        new ExistingPaymentError(
          `Ya existe un pago con el comprobante número ${request.receiptNumber}`
        )
      );
    }

    try {
      let payment: Payment | null = null;

      await session.withTransaction(async () => {
        await Promise.all(
          request.memberDues.map(async (memberDue) => {
            const dues = await this._duePort.findByIds({
              dueIds: memberDue.dues.map((d) => d.dueId),
            });

            dues.forEach((due) => {
              if (due.isPaid()) {
                throw new DuePaidError(due._id);
              }
            });

            const member = await this._memberPort.findOneByIdOrThrow(
              memberDue.memberId
            );

            const paymentMember = PaymentMember.create({
              memberId: memberDue.memberId,
              name: member.name,
            });

            if (paymentMember.isErr()) {
              throw paymentMember.error;
            }

            const paymentDuesResults = memberDue.dues.map((dueRequest) => {
              const due = dues.find((d) => d._id === dueRequest.dueId);

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
            });

            const paymentDues = Result.combine(paymentDuesResults);

            if (paymentDues.isErr()) {
              throw paymentDues.error;
            }

            const paymentResult = Payment.create({
              date: request.date,
              dues: paymentDues.value,
              member: paymentMember.value,
              notes: memberDue.notes,
              receiptNumber: request.receiptNumber,
            });

            if (paymentResult.isErr()) {
              throw paymentResult.error;
            }

            payment = paymentResult.value;

            await Promise.all(
              dues.map(async (due) => {
                const dueRequest = memberDue.dues.find(
                  (d) => d.dueId === due._id
                );

                invariant(dueRequest);

                const result = due.pay({
                  _id: paymentResult.value._id,
                  amount: dueRequest.amount,
                  date: paymentResult.value.date,
                });

                if (result.isErr()) {
                  throw result.error;
                }

                await this._duePort.updateWithSession(due, session);
              })
            );

            await this._paymentPort.createWithSession(
              paymentResult.value,
              session
            );
          })
        );
      });

      if (!payment) {
        return err(new Error('Payment not created'));
      }

      // @ts-expect-error
      return ok({ id: payment._id });
    } catch (error) {
      this._logger.error(error);

      return err(ErrorUtils.unknownToError(error));
    } finally {
      await session.endSession();
    }
  }
}
