import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { Category } from '@domain/categories/entities/category.entity';
import { GetCategoryRequestDto } from '@domain/categories/use-cases/get-category/get-category-request.dto';
import { GetCategoryResponseDto } from '@domain/categories/use-cases/get-category/get-category-response.dto';
import { DIToken } from '@domain/common/tokens.di';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetCategoryUseCase
  extends UseCase
  implements
    IUseCase<GetCategoryRequestDto, GetCategoryResponseDto | undefined>
{
  public constructor(
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort,
  ) {
    super();
  }

  public async execute(
    request: GetCategoryRequestDto,
  ): Promise<Result<GetCategoryResponseDto, Error>> {
    const category = await this._categoryPort.findOneById(request.id);

    if (!category) {
      return err(new EntityNotFoundError(Category));
    }

    return ok({
      _id: category._id,
      amount: category.amount,
      name: category.name,
    });
  }
}
