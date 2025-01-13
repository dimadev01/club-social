import dayjs from 'dayjs';
import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import {
  FindPaginatedMovementsFilters,
  GetMovementsTotalsResponse,
  IMovementRepository,
} from '@application/movements/repositories/movement.repository';
import { DateFormatEnum } from '@shared/utils/date.utils';

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
        filterByDate: [
          '2022-06-01',
          dayjs
            .utc(request.filterByDate[0])
            .subtract(1, 'day')
            .format(DateFormatEnum.DATE),
        ],
      });

      result.total += resultUntilDateFrom.subtotal;
    }

    return ok(result);
  }
}
