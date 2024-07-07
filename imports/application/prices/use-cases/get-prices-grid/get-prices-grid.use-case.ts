import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindPaginatedResponse } from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { PriceGridDto } from '@application/prices/dtos/price-grid-dto';
import {
  FindPaginatedPricesRequest,
  IPriceRepository,
} from '@application/prices/repositories/price.repository';

@injectable()
export class GetPricesGridUseCase
  implements
    IUseCase<FindPaginatedPricesRequest, FindPaginatedResponse<PriceGridDto>>
{
  public constructor(
    @inject(DIToken.IPriceRepository)
    private readonly _priceRepository: IPriceRepository,
  ) {}

  public async execute(
    request: FindPaginatedPricesRequest,
  ): Promise<Result<FindPaginatedResponse<PriceGridDto>, Error>> {
    const { items, totalCount } =
      await this._priceRepository.findPaginated(request);

    const dtos = items.map<PriceGridDto>((price) => ({
      amount: price.amount.amount,
      dueCategory: price.dueCategory,
      memberCategory: price.memberCategory,
      updatedAt: price.updatedAt.toISOString(),
      updatedBy: price.updatedBy,
    }));

    return ok({ items: dtos, totalCount });
  }
}
