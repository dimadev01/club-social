import { injectable } from 'tsyringe';

import { GetCategoriesUseCase } from '@domain/categories/use-cases/get-categories/get-categories.use-case';
import { GetCategoriesByTypeRequestDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-request.dto';
import { GetCategoriesByTypeUseCase } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type.use-case';
import { GetCategoriesGridRequestDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-request.dto';
import { GetCategoriesGridUseCase } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid.use-case';
import { GetCategoryRequestDto } from '@domain/categories/use-cases/get-category/get-category-request.dto';
import { GetCategoryUseCase } from '@domain/categories/use-cases/get-category/get-category.use-case';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { UpdateCategoryUseCase } from '@domain/categories/use-cases/update-category/update-category.use-case';
import { MeteorMethod } from '@infra/meteor/common/meteor-methods.base';
import { MeteorMethodEnum } from '@infra/meteor/common/meteor-methods.enum';

@injectable()
export class CategoryMethod extends MeteorMethod {
  public constructor(
    private readonly _getCategory: GetCategoryUseCase,
    private readonly _getCategories: GetCategoriesUseCase,
    private readonly _getCategoriesByType: GetCategoriesByTypeUseCase,
    private readonly _getCategoriesGrid: GetCategoriesGridUseCase,
    private readonly _updatePrice: UpdateCategoryUseCase,
  ) {
    super();
  }

  public register() {
    Meteor.methods({
      [MeteorMethodEnum.CategoriesGetOne]: (request: GetCategoryRequestDto) =>
        this.execute(this._getCategory, request, GetCategoryRequestDto),

      [MeteorMethodEnum.CategoriesGetAll]: () =>
        this.execute(this._getCategories),

      [MeteorMethodEnum.CategoriesGetGrid]: (
        request: GetCategoriesGridRequestDto,
      ) =>
        this.execute(
          this._getCategoriesGrid,
          request,
          GetCategoriesGridRequestDto,
        ),

      [MeteorMethodEnum.CategoriesUpdate]: (
        request: UpdateCategoryRequestDto,
      ) => this.execute(this._updatePrice, request, UpdateCategoryRequestDto),

      [MeteorMethodEnum.CategoriesGetAllByType]: (
        request: GetCategoriesByTypeRequestDto,
      ) =>
        this.execute(
          this._getCategoriesByType,
          request,
          GetCategoriesByTypeRequestDto,
        ),
    });
  }
}
