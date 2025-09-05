import { container } from 'tsyringe';

import { GetPriceUseCase } from '@application/prices/use-cases/get-price/get-price.use-case';
import { GetPriceByDueCategoryUseCase } from '@application/prices/use-cases/get-price-by-due-category/get-price-by-due-category.use-case';
import { GetPricesGridUseCase } from '@application/prices/use-cases/get-prices-grid/get-prices-grid.use-case';
import { UpdatePriceUseCase } from '@application/prices/use-cases/update-price/update-price.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPriceByDueCategoryRequestDto } from '@ui/dtos/get-price-by-due-category-request.dto';
import { UpdatePriceRequestDto } from '@ui/dtos/update-price-request.dto';

export class PriceMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PricesGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetPriceUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.PricesGetOneByCategory]: (
        req: GetPriceByDueCategoryRequestDto,
      ) =>
        this.execute(
          container.resolve(GetPriceByDueCategoryUseCase),
          GetPriceByDueCategoryRequestDto,
          req,
        ),

      [MeteorMethodEnum.PricesGetGrid]: (req: GetGridRequestDto) =>
        this.execute(
          container.resolve(GetPricesGridUseCase),
          GetGridRequestDto,
          req,
        ),

      [MeteorMethodEnum.PricesUpdate]: (req: UpdatePriceRequestDto) =>
        this.execute(
          container.resolve(UpdatePriceUseCase),
          UpdatePriceRequestDto,
          req,
        ),
    });
  }
}
