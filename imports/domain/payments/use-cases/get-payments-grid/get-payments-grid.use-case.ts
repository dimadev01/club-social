import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import {
  FindPaginatedRequestNewV,
  FindPaginatedResponseNewV,
} from '@domain/common/repositories/queryable-grid-repository.interface';
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
  implements IGridUseCase<FindPaginatedRequestNewV, PaymentGridModelDto>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindPaginatedRequestNewV,
  ): Promise<Result<FindPaginatedResponseNewV<PaymentGridModelDto>, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    return ok<FindPaginatedResponseNewV<PaymentGridModelDto>>({
      items: items.map<PaymentGridModelDto>((item) => {
        invariant(item.member);

        const totalAmount = item.dues.reduce((acc, due) => acc + due.amount, 0);

        return {
          _id: item._id,
          date: item.date.toISOString(),
          dues: item.dues.map<PaymentDueGridModelDto>((paymentDue) => ({
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
