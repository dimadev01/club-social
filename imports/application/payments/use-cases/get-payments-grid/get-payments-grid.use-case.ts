import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetPaymentsGridRequest } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.request';
import { GetPaymentsGridResponse } from '@application/payments/use-cases/get-payments-grid/get-payments-grid.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IPaymentRepository } from '@domain/payments/payment.repository';

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

    return ok({ items, totalCount });
  }
}
