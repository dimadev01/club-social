import { Result, err } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUnitOfWork } from '@application/common/repositories/unit-of-work';
import { IUseCase } from '@application/common/use-case.interface';
import { IDueRepository } from '@application/dues/repositories/due.repository';
import { IMemberCreditRepository } from '@application/members/repositories/member-credit.repository';
import { IMovementRepository } from '@application/movements/repositories/movement.repository';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { IPaymentRepository } from '@application/payments/repositories/payment.repository';
import { CreatePaymentRequest } from '@application/payments/use-cases/create-payment/create-payment.request';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { SendNewPaymentEmailUseCase } from '@application/payments/use-cases/send-new-payment-email/send-new-payment-email.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { DateVo } from '@domain/common/value-objects/date.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { DueNotPayable } from '@domain/dues/errors/due-not-payable.error';
import { Due } from '@domain/dues/models/due.model';
import { MemberCreditTypeEnum } from '@domain/members/member.enum';
import { MemberCredit } from '@domain/members/models/member-credit.model';
import { Movement } from '@domain/movements/models/movement.model';
import { ExistingPaymentError } from '@domain/payments/errors/existing-payment.error';
import { Payment } from '@domain/payments/models/payment.model';
import { CreatePaymentDue } from '@domain/payments/payment.interface';

@injectable()
export class CreatePaymentUseCase
  implements IUseCase<CreatePaymentRequest, PaymentDto>
{
  public constructor(
    @inject(DIToken.IUnitOfWork)
    private readonly _unitOfWork: IUnitOfWork,
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
    @inject(DIToken.IDueRepository)
    private readonly _duePort: IDueRepository,
    @inject(DIToken.IMemberCreditRepository)
    private readonly _memberCreditRepository: IMemberCreditRepository,
    @inject(DIToken.IMovementRepository)
    private readonly _movementRepository: IMovementRepository,
    private readonly _getPaymentUseCase: GetPaymentUseCase,
    private readonly _sendNewPaymentEmailUseCase: SendNewPaymentEmailUseCase,
  ) {
    this._dues = [];
  }

  private _dues: Due[];

  public async execute(
    request: CreatePaymentRequest,
  ): Promise<Result<PaymentDto, Error>> {
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

      this._dues = await this._duePort.findByIds({
        ids: request.dues.map((d) => d.dueId),
      });

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        this._validateDues();

        const paymentResult = Payment.create({
          createDues: this._createPaymentDues(request),
          date: new DateVo(request.date),
          memberId: request.memberId,
          notes: request.notes,
          receiptNumber: request.receiptNumber,
        });

        if (paymentResult.isErr()) {
          throw paymentResult.error;
        }

        const payment = paymentResult.value;

        await this._paymentRepository.insertWithSession(payment, unitOfWork);

        await Promise.all(
          payment.dues.map(async (paymentDue) => {
            const due = this._dues.find((d) => d._id === paymentDue.dueId);

            invariant(due);

            if (paymentDue.totalAmount.isGreaterThan(due.totalPendingAmount)) {
              const memberCredit = MemberCredit.create({
                amount: paymentDue.totalAmount.subtract(due.totalPendingAmount),
                dueId: due._id,
                memberId: request.memberId,
                paymentId: payment._id,
                type: MemberCreditTypeEnum.CREDIT,
              });

              if (memberCredit.isErr()) {
                throw memberCredit.error;
              }

              await this._memberCreditRepository.insertWithSession(
                memberCredit.value,
                unitOfWork,
              );
            }

            const addPaymentResult = due.addPayment({
              creditAmount: paymentDue.creditAmount,
              directAmount: paymentDue.directAmount,
              paymentDate: payment.date,
              paymentId: payment._id,
              paymentReceiptNumber: payment.receiptNumber,
              source: paymentDue.source,
              totalAmount: paymentDue.totalAmount,
            });

            if (addPaymentResult.isErr()) {
              throw addPaymentResult.error;
            }

            await this._duePort.updateWithSession(due, unitOfWork);
          }),
        );

        const movement = Movement.createPayment({
          amount: payment.amount,
          date: payment.date,
          notes: payment.notes,
          paymentId: payment._id,
        });

        if (movement.isErr()) {
          throw movement.error;
        }

        await this._movementRepository.insertWithSession(
          movement.value,
          unitOfWork,
        );

        newPayment = payment;
      });

      invariant(newPayment);

      if (request.sendEmail) {
        const result = await this._sendNewPaymentEmailUseCase.execute({
          id: newPayment._id,
        });

        if (result.isErr()) {
          throw result.error;
        }
      }

      return await this._getPaymentUseCase.execute({ id: newPayment._id });
    } catch (error) {
      if (error instanceof Error) {
        return err(error);
      }

      throw new InternalServerError();
    } finally {
      await this._unitOfWork.end();
    }
  }

  private _validateDues(): void {
    this._dues.forEach((due) => {
      if (!due.isPayable()) {
        throw new DueNotPayable(due._id);
      }
    });
  }

  private _createPaymentDues(
    request: CreatePaymentRequest,
  ): CreatePaymentDue[] {
    const createDues = request.dues.map((requestDue) => {
      const due = this._dues.find((d) => d._id === requestDue.dueId);

      invariant(due);

      const creditAmount = Money.create({ amount: requestDue.creditAmount });

      if (creditAmount.isErr()) {
        throw creditAmount.error;
      }

      const directAmount = Money.create({ amount: requestDue.directAmount });

      if (directAmount.isErr()) {
        throw directAmount.error;
      }

      const createPaymentDue: CreatePaymentDue = {
        creditAmount: creditAmount.value,
        directAmount: directAmount.value,
        dueAmount: due.amount,
        dueCategory: due.category,
        dueDate: due.date,
        dueId: due._id,
        duePendingAmount: due.totalPendingAmount,
      };

      return createPaymentDue;
    });

    return createDues;
  }
}
