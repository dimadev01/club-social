import { injectable } from 'tsyringe';
import { GetCategoriesUseCase } from '@application/use-cases/get-categories/get-categories.use-case';
import { GetCategoryRequestDto } from '@application/use-cases/get-category/get-category-request.dto';
import { GetCategoryUseCase } from '@application/use-cases/get-category/get-category.use-case';
import { UpdateCategoryRequestDto } from '@application/use-cases/update-category/update-category-request.dto';
import { UpdateCategoryUseCase } from '@application/use-cases/update-category/update-category.use-case';
import { BaseMethod } from '@infra/meteor/common/meteor-methods.base';
import { MethodsEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class CategoriesMethods extends BaseMethod {
  public constructor(
    private readonly _getCategory: GetCategoryUseCase,
    private readonly _getCategories: GetCategoriesUseCase,
    private readonly _updatePrice: UpdateCategoryUseCase
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MethodsEnum.CategoriesGetOne]: (request: GetCategoryRequestDto) =>
        this.execute(this._getCategory, request, GetCategoryRequestDto),
      [MethodsEnum.CategoriesGetAll]: () => this.execute(this._getCategories),

      [MethodsEnum.CategoriesUpdate]: (request: UpdateCategoryRequestDto) =>
        this.execute(this._updatePrice, request, UpdateCategoryRequestDto),
    });
  }
}
