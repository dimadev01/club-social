import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import {
  PaymentDueGridDto,
  PaymentGridDto,
} from '@application/payments/dtos/payment-grid-dto';
import { GetPaymentsGridRequest } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.request';
import { GetPaymentsGridResponse } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class GetPaymentsGridUseCase
  implements IUseCase<GetPaymentsGridRequest, GetPaymentsGridResponse>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: GetPaymentsGridRequest,
  ): Promise<Result<GetPaymentsGridResponse, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    return ok<GetPaymentsGridResponse>({
      items: items.map<PaymentGridDto>((payment) => {
        invariant(payment.member);

        return {
          date: payment.date.toISOString(),
          dues:
            payment.dues?.map<PaymentDueGridDto>((paymentDue) => {
              invariant(paymentDue.due);

              return {
                _id: paymentDue._id,
                amount: paymentDue.amount.amount,
                due: {
                  amount: paymentDue.due.amount.amount,
                  category: paymentDue.due.category,
                  date: paymentDue.due.date.toISOString(),
                  id: paymentDue.due._id,
                  memberId: paymentDue.due.memberId,
                  notes: paymentDue.due.notes,
                  status: paymentDue.due.status,
                },
              };
            }) ?? [],
          id: payment._id,
          isDeleted: payment.isDeleted,
          memberId: payment.memberId,
          memberName: payment.member.name,
          paymentDuesCount: payment.dues?.length ?? 0,
          receiptNumber: payment.receiptNumber,
          totalAmount: payment.getTotalAmountOfDues(),
        };
      }),
      totalCount,
    });
  }
}
