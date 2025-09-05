import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { PriceDto } from '@application/prices/dtos/price.dto';
import { PriceDtoMapper } from '@application/prices/mappers/price-dto.mapper';
import { IPriceRepository } from '@application/prices/repositories/price.repository';
import { GetPriceByDueCategoryRequest } from '@application/prices/use-cases/get-price-by-due-category/get-price-by-due-category.request';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

@injectable()
export class GetPriceByDueCategoryUseCase
  implements IUseCase<GetPriceByDueCategoryRequest, PriceDto>
{
  public constructor(
    @inject(DIToken.IPriceRepository)
    private readonly _priceRepository: IPriceRepository,
    private readonly _priceDtoMapper: PriceDtoMapper,
  ) {}

  public async execute(
    request: GetPriceByDueCategoryRequest,
  ): Promise<Result<PriceDto, Error>> {
    const price = await this._priceRepository.findOneByCategory(
      request.dueCategory,
    );

    if (!price) {
      return err(new ModelNotFoundError());
    }

    return ok(this._priceDtoMapper.toDto(price));
  }
}
