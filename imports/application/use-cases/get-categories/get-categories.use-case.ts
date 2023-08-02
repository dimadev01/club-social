import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ICategoryRepository } from '@application/repositories/category-repository.interface';
import { GetCategoriesResponseDto } from '@application/use-cases/get-categories/get-categories-response.dto';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class GetCategoriesUseCase
  extends UseCase
  implements IUseCase<undefined, GetCategoriesResponseDto[]>
{
  public constructor(
    @inject(Tokens.CategoryRepository)
    private readonly _categoryRepository: ICategoryRepository
  ) {
    super();
  }

  public async execute(): Promise<Result<GetCategoriesResponseDto[], Error>> {
    const data = await this._categoryRepository.findAll();

    return ok<GetCategoriesResponseDto[]>(
      data.map((category) => ({
        _id: category._id,
        amount: category.amount,
        amountFormatted: category.amountFormatted,
        code: category.code,
        name: category.name,
      }))
    );
  }
}
