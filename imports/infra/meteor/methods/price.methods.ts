import { container } from 'tsyringe';

import { GetPriceUseCase } from '@application/prices/use-cases/get-price/get-price.use-case';
import { GetPricesGridUseCase } from '@application/prices/use-cases/get-prices-grid/get-prices-grid.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetGridRequestDto } from '@ui/common/dtos/get-grid-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPriceRequestDto } from '@ui/dtos/get-price-request.dto';

export class PriceMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PricesGetOneByCategory]: (req: GetPriceRequestDto) =>
        this.execute(
          container.resolve(GetPriceUseCase),
          GetPriceRequestDto,
          req,
        ),

      [MeteorMethodEnum.PricesGetGrid]: (req: GetGridRequestDto) =>
        this.execute(
          container.resolve(GetPricesGridUseCase),
          GetGridRequestDto,
          req,
        ),
    });
  }
}
