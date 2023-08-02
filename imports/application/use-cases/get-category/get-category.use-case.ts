import { err, ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { EntityNotFoundError } from '@application/errors/entity-not-found.error';
import { ICategoryRepository } from '@application/repositories/category-repository.interface';
import { GetCategoryRequestDto } from '@application/use-cases/get-category/get-category-request.dto';
import { GetCategoryResponseDto } from '@application/use-cases/get-category/get-category-response.dto';
import { Category } from '@domain/entities/category.entity';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class GetCategoryUseCase
  extends UseCase
  implements
    IUseCase<GetCategoryRequestDto, GetCategoryResponseDto | undefined>
{
  public constructor(
    @inject(Tokens.CategoryRepository)
    private readonly _categoryRepository: ICategoryRepository
  ) {
    super();
  }

  public async execute(
    request: GetCategoryRequestDto
  ): Promise<Result<GetCategoryResponseDto | undefined, Error>> {
    const category = await this._categoryRepository.findOneById(request.id);

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
