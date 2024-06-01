import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { GetCategoriesResponseDto } from '@domain/categories/use-cases/get-categories/get-categories-response.dto';
import { DIToken } from '@domain/common/tokens.di';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class GetCategoriesUseCase
  extends UseCaseOld
  implements IUseCaseOld<null, GetCategoriesResponseDto[]>
{
  public constructor(
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort,
  ) {
    super();
  }

  public async execute(): Promise<Result<GetCategoriesResponseDto[], Error>> {
    const categories = await this._categoryPort.findAll();

    return ok<GetCategoriesResponseDto[]>(
      categories.map((category) => ({
        _id: category._id,
        amount: category.amount,
        amountFormatted: category.amountFormatted,
        code: category.code,
        name: category.name,
      })),
    );
  }
}
