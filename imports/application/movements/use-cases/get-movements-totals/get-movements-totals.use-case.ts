import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import {
  FindPaginatedMovementsFilters,
  GetMovementsTotalsResponse,
  IMovementRepository,
} from '@application/movements/repositories/movement.repository';

@injectable()
export class GetMovementsTotalUseCase
  implements
    IUseCase<FindPaginatedMovementsFilters, GetMovementsTotalsResponse>
{
  public constructor(
    @inject(DIToken.IMovementRepository)
    private readonly movementRepository: IMovementRepository,
  ) {}

  public async execute(
    request: FindPaginatedMovementsFilters,
  ): Promise<Result<GetMovementsTotalsResponse, Error>> {
    const result = await this.movementRepository.getTotals(request);

    if (request.filterByDate.length > 0) {
      const resultUntilDateFrom = await this.movementRepository.getTotals({
        ...request,
        filterByDate: ['2022-06-01', request.filterByDate[0]],
      });

      result.total += resultUntilDateFrom.total;
    }

    return ok(result);
  }
}
