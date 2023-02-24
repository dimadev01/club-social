import { injectable } from 'tsyringe';
import { GetPriceRequestDto } from '@domain/categories/use-cases/get-price/get-price-request.dto';
import { GetPriceUseCase } from '@domain/categories/use-cases/get-price/get-price.use-case';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { UpdateCategoryUseCase } from '@domain/categories/use-cases/update-category/update-category.use-case';
import { BaseMethod } from '@infra/methods/methods.base';
import { MethodsEnum } from '@infra/methods/methods.enum';

@injectable()
export class CategoriesMethods extends BaseMethod {
  public constructor(
    private readonly _getPrice: GetPriceUseCase,
    private readonly _updatePrice: UpdateCategoryUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.CategoriesGetAll]: (request: GetPriceRequestDto) =>
        this.execute(this._getPrice, request),

      [MethodsEnum.CategoriesUpdate]: (request: UpdateCategoryRequestDto) =>
        this.execute(this._updatePrice, request),
    });
  }
}
