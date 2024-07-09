import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import {
  FindPaginatedRequest,
  FindPaginatedResponse,
} from '@application/common/repositories/grid.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { PriceDto } from '@application/prices/dtos/price.dto';
import { PriceDtoMapper } from '@application/prices/mappers/price-dto.mapper';
import { IPriceRepository } from '@application/prices/repositories/price.repository';

@injectable()
export class GetPricesGridUseCase
  implements IUseCase<FindPaginatedRequest, FindPaginatedResponse<PriceDto>>
{
  public constructor(
    @inject(DIToken.IPriceRepository)
    private readonly _priceRepository: IPriceRepository,
    private readonly _priceDtoMapper: PriceDtoMapper,
  ) {}

  public async execute(
    request: FindPaginatedRequest,
  ): Promise<Result<FindPaginatedResponse<PriceDto>, Error>> {
    const { items, totalCount } =
      await this._priceRepository.findPaginated(request);

    const dtos = items.map<PriceDto>((price) =>
      this._priceDtoMapper.toDto(price),
    );

    return ok({ items: dtos, totalCount });
  }
}
