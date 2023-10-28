import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { GetCategoriesResponseDto } from '@domain/categories/use-cases/get-categories/get-categories-response.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetCategoriesUseCase
  extends UseCase
  implements IUseCase<undefined, GetCategoriesResponseDto[]>
{
  public constructor(
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort
  ) {
    super();
  }

  public async execute(): Promise<Result<GetCategoriesResponseDto[], Error>> {
    const data = await this._categoryPort.findAll();

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
