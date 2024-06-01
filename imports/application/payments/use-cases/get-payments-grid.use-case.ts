import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import {
  PaymentDueGridModelDto,
  PaymentGridModelDto,
} from '@application/payments/dtos/payment-grid-model-dto';
import { FindPaginatedResponse } from '@domain/common/repositories/grid.repository';
import { DIToken } from '@domain/common/tokens.di';
import { IGridUseCase } from '@domain/common/use-case.interface';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { FindPaginatedPaymentsRequest } from '@domain/payments/repositories/payment-repository.types';
import { IPaymentRepository } from '@domain/payments/repositories/payment.repository';

@injectable()
export class GetPaymentsGridUseCase
  implements IGridUseCase<FindPaginatedPaymentsRequest, PaymentGridModelDto>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindPaginatedPaymentsRequest,
  ): Promise<Result<FindPaginatedResponse<PaymentGridModelDto>, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    return ok<FindPaginatedResponse<PaymentGridModelDto>>({
      items: items.map<PaymentGridModelDto>((payment) => {
        invariant(payment.member);

        invariant(payment.dues);

        return {
          _id: payment._id,
          date: payment.date.toISOString(),
          dues: payment.dues.map<PaymentDueGridModelDto>((paymentDue) => ({
            _id: paymentDue._id,
            amount: paymentDue.amount,
            dueAmount: paymentDue.amount,
            dueCategory: DueCategoryEnum.ELECTRICITY,
            dueDate: '',
          })),
          isDeleted: payment.isDeleted,
          memberId: payment.memberId,
          memberName: payment.member.name,
          paymentDuesCount: payment.dues.length,
          receiptNumber: payment.receiptNumber,
          totalAmount: payment.getTotalAmountOfDues(),
        };
      }),
      totalCount,
    });
  }
}
