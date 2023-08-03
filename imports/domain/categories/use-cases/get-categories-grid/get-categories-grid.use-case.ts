import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ICategoryPort } from '@domain/categories/category.port';
import { GetCategoriesGridRequestDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-request.dto';
import { GetCategoriesGridResponseDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-response.dto';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class GetCategoriesGridUseCase
  extends UseCase<GetCategoriesGridRequestDto>
  implements
    IUseCase<GetCategoriesGridRequestDto, GetCategoriesGridResponseDto>
{
  public constructor(
    @inject(Tokens.CategoryRepository)
    private readonly _categoryRepository: ICategoryPort
  ) {
    super();
  }

  async execute(
    request: GetCategoriesGridRequestDto
  ): Promise<Result<GetCategoriesGridResponseDto, Error>> {
    const response = await this._categoryRepository.findPaginated(request);

    console.log(response);

    return ok<GetCategoriesGridResponseDto>({
      count: response.count,
      data: response.data.map((category) => ({
        _id: category._id,
        name: category.name,
        price: category.amount,
        priceFormatted: category.amountFormatted,
      })),
    });
  }
}
