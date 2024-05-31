import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import {
  FindPaginatedRequestNewV,
  FindPaginatedResponseNewV,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IGridUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/payment-repository.interface';
import { PaymentGridModelDto } from '@domain/payments/use-cases/get-payments-grid/payment-grid-model-dto';

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

        return {
          _id: item._id,
          date: item.date.format(),
          isDeleted: item.isDeleted,
          isoDate: item.date.toISOString(),
          memberId: item.memberId,
          memberName: item.member.name,
          paymentDuesCount: 0,
        };
      }),
      totalCount,
    });
  }
}
