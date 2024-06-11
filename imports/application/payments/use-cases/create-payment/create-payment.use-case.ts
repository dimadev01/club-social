import { Result, err } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { PaymentDto } from '@application/payments/dtos/payment.dto';
import { CreatePaymentRequest } from '@application/payments/use-cases/create-payment/create-payment.request';
import { GetPaymentUseCase } from '@application/payments/use-cases/get-payment/get-payment.use-case';
import { InternalServerError } from '@domain/common/errors/internal-server.error';
import { IUnitOfWork } from '@domain/common/repositories/unit-of-work';
import { IUseCase } from '@domain/common/use-case.interface';
import { DateUtcVo } from '@domain/common/value-objects/date-utc.value-object';
import { Money } from '@domain/common/value-objects/money.value-object';
import { IDueRepository } from '@domain/dues/due.repository';
import { IMemberCreditRepository } from '@domain/members/member-credit.repository';
import { MemberCreditTypeEnum } from '@domain/members/member.enum';
import { MemberCredit } from '@domain/members/models/member-credit.model';
import { Movement } from '@domain/movements/models/movement.model';
import { IMovementRepository } from '@domain/movements/movement.repository';
import { DuePaidError } from '@domain/payments/errors/due-paid.error';
import { ExistingPaymentError } from '@domain/payments/errors/existing-payment.error';
import { Payment } from '@domain/payments/models/payment.model';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
import { CreatePaymentDue } from '@domain/payments/payment.interface';
import { IPaymentRepository } from '@domain/payments/payment.repository';

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
  ) {}

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

      let newPaymentId: string | undefined;

      await this._unitOfWork.withTransaction(async (unitOfWork) => {
        const dues = await this._duePort.findByIds({
          ids: request.dues.map((d) => d.dueId),
        });

        dues.forEach((due) => {
          if (due.isPaid()) {
            throw new DuePaidError(due._id);
          }
        });

        const createDues = request.dues.map((requestDue) => {
          const due = dues.find((d) => d._id === requestDue.dueId);

          invariant(due);

          const createPaymentDue: CreatePaymentDue = {
            amount: new Money({ amount: requestDue.amount }),
            dueAmount: due.amount,
            dueCategory: due.category,
            dueDate: due.date,
            dueId: due._id,
            source: PaymentDueSourceEnum.DIRECT,
          };

          return createPaymentDue;
        });

        const newPaymentResult = Payment.createOne({
          createDues,
          date: new DateUtcVo(request.date),
          memberId: request.memberId,
          notes: request.notes,
          receiptNumber: request.receiptNumber,
        });

        if (newPaymentResult.isErr()) {
          throw newPaymentResult.error;
        }

        const newPayment = newPaymentResult.value;

        await this._paymentRepository.insertWithSession(newPayment, unitOfWork);

        await Promise.all(
          newPayment.dues.map(async (paymentDue) => {
            const due = dues.find((d) => d._id === paymentDue.dueId);

            invariant(due);

            if (paymentDue.amount.isGreaterThan(due.totalPendingAmount)) {
              const memberCredit = MemberCredit.createOne({
                amount: paymentDue.amount.subtract(due.totalPendingAmount),
                dueId: due._id,
                memberId: request.memberId,
                paymentId: newPayment._id,
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

            due.addPayment({
              amount: paymentDue.amount,
              date: newPayment.date,
              paymentId: newPayment._id,
              receiptNumber: newPayment.receiptNumber,
            });

            await this._duePort.updateWithSession(due, unitOfWork);
          }),
        );

        const movement = Movement.createPayment({
          amount: newPayment.amount,
          date: newPayment.date,
          notes: newPayment.notes,
          paymentId: newPayment._id,
        });

        if (movement.isErr()) {
          throw movement.error;
        }

        await this._movementRepository.insertWithSession(
          movement.value,
          unitOfWork,
        );

        newPaymentId = newPayment._id;
      });

      invariant(newPaymentId);

      return await this._getPaymentUseCase.execute({ id: newPaymentId });
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
