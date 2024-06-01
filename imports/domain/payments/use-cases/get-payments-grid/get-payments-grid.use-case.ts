import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/grid.repository';
import { DIToken } from '@domain/common/tokens.di';
import { IGridUseCase } from '@domain/common/use-case.interface';
import { DueCategoryEnum } from '@domain/dues/due.enum';
import { IPaymentRepository } from '@domain/payments/repositories/payment-repository.interface';
import {
  PaymentDueGridModelDto,
  PaymentGridModelDto,
} from '@domain/payments/use-cases/get-payments-grid/payment-grid-model-dto';

@injectable()
export class GetPaymentsGridUseCase
  implements IGridUseCase<FindPaginatedRequest, PaymentGridModelDto>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindPaginatedRequest,
  ): Promise<Result<FindPaginatedResponse<PaymentGridModelDto>, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    return ok<FindPaginatedResponse<PaymentGridModelDto>>({
      items: items.map<PaymentGridModelDto>((item) => {
        invariant(item.member);

        const totalAmount = item.dues.reduce((acc, due) => acc + due.amount, 0);

        return {
          _id: item._id,
          date: item.date.toISOString(),
          dues: item.dues.map<PaymentDueGridModelDto>((paymentDue) => ({
            _id: paymentDue._id,
            amount: paymentDue.amount,
            dueAmount: 0,
            dueCategory: DueCategoryEnum.ELECTRICITY,
            dueDate: '',
          })),
          isDeleted: item.isDeleted,
          memberId: item.memberId,
          memberName: item.member.name,
          paymentDuesCount: item.dues.length,
          receiptNumber: item.receiptNumber,
          totalAmount,
        };
      }),
      totalCount,
    });
  }
}
