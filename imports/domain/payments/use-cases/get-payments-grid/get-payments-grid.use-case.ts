import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IGridUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/payment-repository.interface';
import { GetPaymentGridResponse } from '@domain/payments/use-cases/get-payments-grid/get-payment-grid.response';

@injectable()
export class GetPaymentsGridUseCase
  implements IGridUseCase<FindPaginatedRequest, GetPaymentGridResponse>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindPaginatedRequest,
  ): Promise<Result<FindPaginatedResponse<GetPaymentGridResponse>, Error>> {
    const { items, totalCount } =
      await this._paymentRepository.findPaginated(request);

    return ok<FindPaginatedResponse<GetPaymentGridResponse>>({
      items: items.map<GetPaymentGridResponse>((item) => ({
        _id: item._id,
        date: item.date.format(),
        isDeleted: item.isDeleted,
        isoDate: item.date.toISOString(),
        memberId: item.memberId,
        memberName: item.memberId,
        paymentDuesCount: 0,
      })),
      totalCount,
    });
  }
}
