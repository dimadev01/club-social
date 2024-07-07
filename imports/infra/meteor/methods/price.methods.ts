import { container } from 'tsyringe';

import { GetPriceUseCase } from '@application/prices/use-cases/get-price/get-price.use-case';
import { GetPricesGridUseCase } from '@application/prices/use-cases/get-prices-grid/get-prices-grid.use-case';
import { MeteorMethods } from '@infra/meteor/common/meteor-methods';
import { GetOneByIdRequestDto } from '@ui/common/dtos/get-one-dto-request.dto';
import { MeteorMethodEnum } from '@ui/common/meteor/meteor-methods.enum';
import { GetPricesGridRequestDto } from '@ui/dtos/get-prices-grid-request.dto';

export class PaymentMethods extends MeteorMethods {
  public register(): void {
    Meteor.methods({
      [MeteorMethodEnum.PricesGetOne]: (req: GetOneByIdRequestDto) =>
        this.execute(
          container.resolve(GetPriceUseCase),
          GetOneByIdRequestDto,
          req,
        ),

      [MeteorMethodEnum.PricesGetGrid]: (req: GetPricesGridRequestDto) =>
        this.execute(
          container.resolve(GetPricesGridUseCase),
          GetPricesGridRequestDto,
          req,
        ),
    });
  }
}
