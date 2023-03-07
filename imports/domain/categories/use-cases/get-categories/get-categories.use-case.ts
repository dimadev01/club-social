import { plainToInstance } from 'class-transformer';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CategoriesCollection } from '@domain/categories/categories.collection';
import { Category } from '@domain/categories/category.entity';
import { GetCategoriesResponseDto } from '@domain/categories/use-cases/get-categories/get-categories-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetCategoriesUseCase
  extends UseCase
  implements IUseCase<undefined, GetCategoriesResponseDto[]>
{
  public async execute(): Promise<Result<GetCategoriesResponseDto[], Error>> {
    const data = await CategoriesCollection.rawCollection()
      .aggregate([
        {
          $lookup: {
            as: 'movements',
            foreignField: 'category',
            from: 'movements',
            localField: 'code',
          },
        },
      ])
      .toArray();

    return ok<GetCategoriesResponseDto[]>(
      data
        .map((category) => plainToInstance(Category, category))
        .map((category) => ({
          _id: category._id,
          amount: category.amount,
          amountFormatted: category.amountFormatted,
          code: category.code,
          name: category.name,
        }))
    );
  }
}
