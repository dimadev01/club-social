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
import { DuePaidError } from '@domain/payments/errors/due-paid.error';
import { ExistingPaymentError } from '@domain/payments/errors/existing-payment.error';
import { Payment } from '@domain/payments/models/payment.model';
import { PaymentDueSourceEnum } from '@domain/payments/payment.enum';
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

        const newPayment = Payment.createOne({
          date: new DateUtcVo(request.date),
          memberId: request.memberId,
          notes: request.notes,
          receiptNumber: request.receiptNumber,
        });

        if (newPayment.isErr()) {
          throw newPayment.error;
        }

        newPaymentId = newPayment.value._id;

        await Promise.all(
          request.dues.map(async (requestDue) => {
            const due = dues.find((d) => d._id === requestDue.dueId);

            invariant(due);

            const amountToPay = new Money({ amount: requestDue.amount });

            const addPaymentResult = due.addPayment({
              amount: amountToPay,
              date: new DateUtcVo(request.date),
              paymentId: newPayment.value._id,
              receiptNumber: request.receiptNumber,
            });

            if (addPaymentResult.isErr()) {
              throw addPaymentResult.error;
            }

            const newPaymentDue = newPayment.value.addDue({
              amount: amountToPay,
              dueAmount: due.amount,
              dueCategory: due.category,
              dueDate: due.date,
              dueId: due._id,
              source: PaymentDueSourceEnum.DIRECT,
            });

            if (newPaymentDue.isErr()) {
              throw newPaymentDue.error;
            }

            if (newPaymentDue.value.amount.isGreaterThan(due.amount)) {
              const memberCredit = MemberCredit.createOne({
                amount: newPaymentDue.value.amount.subtract(due.amount),
                memberId: newPayment.value.memberId,
                paymentDueId: newPaymentDue.value.dueId,
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

            await this._duePort.updateWithSession(due, unitOfWork);
          }),
        );

        await this._paymentRepository.insertWithSession(
          newPayment.value,
          unitOfWork,
        );
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
