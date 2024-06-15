import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import {
  FindPaginatedPaymentsFilters,
  GetPaymentsTotalsResponse,
  IPaymentRepository,
} from '@application/payments/repositories/payment.repository';

@injectable()
export class GetPaymentsTotalUseCase
  implements IUseCase<FindPaginatedPaymentsFilters, GetPaymentsTotalsResponse>
{
  public constructor(
    @inject(DIToken.IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  public async execute(
    request: FindPaginatedPaymentsFilters,
  ): Promise<Result<GetPaymentsTotalsResponse, Error>> {
    const result = await this.paymentRepository.getTotals(request);

    return ok(result);
  }
}
