import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { GetCategoriesGridRequestDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-request.dto';
import { GetCategoriesGridResponseDto } from '@domain/categories/use-cases/get-categories-grid/get-categories-grid-response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetCategoriesGridUseCase
  extends UseCase<GetCategoriesGridRequestDto>
  implements
    IUseCase<GetCategoriesGridRequestDto, GetCategoriesGridResponseDto>
{
  public constructor(
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort,
  ) {
    super();
  }

  async execute(
    request: GetCategoriesGridRequestDto,
  ): Promise<Result<GetCategoriesGridResponseDto, Error>> {
    const response = await this._categoryPort.findPaginated(request);

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
