import type { ClientSession } from 'mongodb';
import { Result, err, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { PaymentModelDto } from '@application/payments/dtos/payment-model.dto';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { DIToken } from '@domain/common/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { IDuePortOld } from '@domain/dues/due.port';
import { PaymentDueModel } from '@domain/payment-dues/models/payment-due.model';
import { IPaymentDueRepository } from '@domain/payment-dues/repositories/payment-due-repository.interface';
import { DuePaidError } from '@domain/payments/errors/due-paid.error';
import { ExistingPaymentError } from '@domain/payments/errors/existing-payment.error';
import { PaymentModel } from '@domain/payments/models/payment.model';
import { CreatePaymentRequest } from '@domain/payments/payment.types';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class CreatePaymentUseCase<TSession>
  implements IUseCase<CreatePaymentRequest, PaymentModelDto>
{
  public constructor(
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork<TSession>,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository<TSession>,
    @inject(DIToken.IPaymentDueRepository)
    private readonly _paymentDueRepository: IPaymentDueRepository<TSession>,
    @inject(DIToken.DueRepository)
    private readonly _duePort: IDuePortOld,
    private readonly _getPayment: GetPaymentUseCase,
  ) {}

  public async execute(
    request: CreatePaymentRequest,
  ): Promise<Result<PaymentModelDto, Error>> {
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

      let newPaymentId: string | undefined;

      await this._unitOfWork.withTransaction(async (session) => {
        const dues = await this._duePort.findByIds(
          request.dues.map((d) => d.dueId),
        );

        dues.forEach((due) => {
          if (due.isPaid()) {
            throw new DuePaidError(due._id);
          }
        });

        const newPaymentResult = PaymentModel.createOne({
          date: new DateUtcVo(request.date),
          memberId: request.memberId,
          notes: request.notes,
          receiptNumber: request.receiptNumber,
        });

        if (newPaymentResult.isErr()) {
          throw newPaymentResult.error;
        }

        newPaymentId = newPaymentResult.value._id;

        await Promise.all(
          dues.map(async (due) => {
            const requestDue = request.dues.find((d) => d.dueId === due._id);

            invariant(requestDue);

            const result = due.pay({
              _id: newPaymentResult.value._id,
              amount: requestDue.amount,
              date: newPaymentResult.value.date.toDate(),
            });

            if (result.isErr()) {
              throw result.error;
            }

            await this._duePort.updateWithSession(
              due,
              session as ClientSession,
            );

            const newPaymentDue = PaymentDueModel.createOne({
              amount: requestDue.amount,
              dueId: due._id,
              paymentId: newPaymentResult.value._id,
            });

            if (newPaymentDue.isErr()) {
              throw newPaymentDue.error;
            }

            await this._paymentDueRepository.insertWithSession(
              newPaymentDue.value,
              session,
            );
          }),
        );

        await this._paymentRepository.insertWithSession(
          newPaymentResult.value,
          session,
        );
      });

      invariant(newPaymentId);

      const payment = await this._getPayment.execute({ id: newPaymentId });

      if (payment.isErr()) {
        return err(payment.error);
      }

      invariant(payment.value);

      return ok(payment.value);
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
