import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { GetCategoriesByTypeRequestDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-request.dto';
import { GetCategoriesByTypeResponseDto } from '@domain/categories/use-cases/get-categories-by-type/get-categories-by-type-response.dto';
import { DIToken } from '@domain/common/tokens.di';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class GetCategoriesByTypeUseCase
  extends UseCaseOld
  implements
    IUseCaseOld<
      GetCategoriesByTypeRequestDto,
      GetCategoriesByTypeResponseDto[]
    >
{
  public constructor(
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort,
  ) {
    super();
  }

  public async execute(
    request: GetCategoriesByTypeRequestDto,
  ): Promise<Result<GetCategoriesByTypeResponseDto[], Error>> {
    const categories = await this._categoryPort.findByAllByType(request.type);

    return ok<GetCategoriesByTypeResponseDto[]>(
      categories.map((category) => ({
        _id: category._id,
        amount: category.amount,
        code: category.code,
        name: category.name,
      })),
    );
  }
}
