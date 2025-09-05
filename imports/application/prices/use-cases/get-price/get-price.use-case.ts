import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { PriceDto } from '@application/prices/dtos/price.dto';
import { PriceDtoMapper } from '@application/prices/mappers/price-dto.mapper';
import { IPriceCategoryRepository } from '@application/prices/repositories/price-category.repository';
import { IPriceRepository } from '@application/prices/repositories/price.repository';

@injectable()
export class GetPriceUseCase implements IUseCase<FindOneById, PriceDto> {
  public constructor(
    @inject(DIToken.IPriceRepository)
    private readonly _priceRepository: IPriceRepository,
    @inject(DIToken.IPriceCategoryRepository)
    private readonly _priceCategoryRepository: IPriceCategoryRepository,
    private readonly _priceDtoMapper: PriceDtoMapper,
  ) {}

  public async execute(request: FindOneById): Promise<Result<PriceDto, Error>> {
    const price = await this._priceRepository.findOneByIdOrThrow({
      id: request.id,
    });

    price.categories = await this._priceCategoryRepository.findByPrice(
      price._id,
    );

    return ok(this._priceDtoMapper.toDto(price));
  }
}
