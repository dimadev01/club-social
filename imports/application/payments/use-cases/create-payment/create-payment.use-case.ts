import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { CreatePaymentRequest } from '@application/payments/use-cases/create-payment/create-payment.request';
import { CreatePaymentResponse } from '@application/payments/use-cases/create-payment/create-payment.response';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { IDueRepository } from '@domain/dues/due.repository';
import { DuePaidError } from '@domain/payments/errors/due-paid.error';
import { ExistingPaymentError } from '@domain/payments/errors/existing-payment.error';
import { PaymentDue } from '@domain/payments/models/payment-due.model';
import { Payment } from '@domain/payments/models/payment.model';
import { IPaymentDueRepository } from '@domain/payments/payment-due.repository';
import { IPaymentRepository } from '@domain/payments/payment.repository';

@injectable()
export class CreatePaymentUseCase
  implements IUseCase<CreatePaymentRequest, CreatePaymentResponse>
{
  public constructor(
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IPaymentDueRepository)
    private readonly _paymentDueRepository: IPaymentDueRepository,
    @inject(DIToken.IDueRepository)
    private readonly _duePort: IDueRepository,
  ) {}

  public async execute(
    request: CreatePaymentRequest,
  ): Promise<Result<CreatePaymentResponse, Error>> {
    const existingPaymentByReceipt =
      await this._paymentRepository.findOneByReceipt(request.receiptNumber);

    if (existingPaymentByReceipt) {
      return err(
        new ExistingPaymentError(
          `Ya existe un pago con el Recibo número ${request.receiptNumber}`,
        ),
      );
    }

    try {
      this._unitOfWork.start();

      let newPayment: Payment | undefined;

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const dues = await this._duePort.findByIds({
          ids: request.dues.map((d) => d.dueId),
        });

        dues.forEach((due) => {
          if (due.isPaid()) {
            throw new DuePaidError(due._id);
          }
        });

        const newPaymentResult = Payment.createOne({
          date: new DateUtcVo(request.date),
          memberId: request.memberId,
          notes: request.notes,
          receiptNumber: request.receiptNumber,
        });

        if (newPaymentResult.isErr()) {
          throw newPaymentResult.error;
        }

        newPayment = newPaymentResult.value;

        await Promise.all(
          dues.map(async (due) => {
            const requestDue = request.dues.find((d) => d.dueId === due._id);

            invariant(requestDue);

            const result = due.pay(new Money({ amount: requestDue.amount }));

            if (result.isErr()) {
              throw result.error;
            }

            await this._duePort.updateWithSession(due, unitOfWork);

            const newPaymentDue = PaymentDue.createOne({
              amount: new Money({ amount: requestDue.amount }),
              dueId: due._id,
              paymentId: newPaymentResult.value._id,
            });

            if (newPaymentDue.isErr()) {
              throw newPaymentDue.error;
            }

            await this._paymentDueRepository.insertWithSession(
              newPaymentDue.value,
              unitOfWork,
            );
          }),
        );

        await this._paymentRepository.insertWithSession(
          newPaymentResult.value,
          unitOfWork,
        );
      });

      invariant(newPayment);

      return ok(newPayment);
    } catch (error) {
      if (error instanceof Error) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }
}
