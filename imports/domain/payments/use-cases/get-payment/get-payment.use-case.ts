import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { PaymentDue } from '@domain/payments/entities/payment-due';
import { IPaymentPort } from '@domain/payments/payment.port';
import { GetPaymentRequestDto } from '@domain/payments/use-cases/get-payment/get-payment-request.dto';
import { GetPaymentResponseDto } from '@domain/payments/use-cases/get-payment/get-payment-response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { PaymentNotFoundError } from '@domain/payments/errors/payment-not-found.error';

@injectable()
export class GetPaymentUseCase
  extends UseCase<GetPaymentRequestDto>
  implements IUseCase<GetPaymentRequestDto, GetPaymentResponseDto | null>
{
  public constructor(
    @inject(DIToken.PaymentRepository)
    private readonly _paymentPort: IPaymentPort,
  ) {
    super();
  }

  public async execute(
    request: GetPaymentRequestDto,
  ): Promise<Result<GetPaymentResponseDto | null, Error>> {
    const payment = await this._paymentPort.findOneById(request.id);

    if (!payment || payment.isDeleted) {
      return err(new PaymentNotFoundError());
    }

    return ok<GetPaymentResponseDto>({
      _id: payment._id,
      date: payment.dateFormatted,
      dues: payment.dues.map((paymentDue: PaymentDue) => ({
        amount: paymentDue.amount,
        dueAmount: paymentDue.due.amount,
        dueCategory: paymentDue.due.category,
        dueDate: paymentDue.due.dateFormatted,
        dueId: paymentDue.due._id,
        membershipMonth: paymentDue.due.membershipMonth,
      })),
      memberId: payment.memberId._id,
      memberName: payment.memberId.name,
      notes: payment.notes,
      receiptNumber: payment.receiptNumber,
    });
  }
}
