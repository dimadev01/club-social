import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { PriceDto } from '@application/prices/dtos/price.dto';
import { PriceDtoMapper } from '@application/prices/mappers/price-dto.mapper';
import { IPriceRepository } from '@application/prices/repositories/price.repository';
import { GetPriceRequest } from '@application/prices/use-cases/get-price/get-price-request';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

@injectable()
export class GetPriceUseCase implements IUseCase<GetPriceRequest, PriceDto> {
  public constructor(
    @inject(DIToken.IPriceRepository)
    private readonly _priceRepository: IPriceRepository,
    private readonly _priceDtoMapper: PriceDtoMapper,
  ) {}

  public async execute(
    request: GetPriceRequest,
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
