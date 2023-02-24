import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CategoriesCollection } from '@domain/categories/categories.collection';
import { PriceNotFoundError } from '@domain/categories/errors/price-not-found.error';
import { GetPriceRequestDto } from '@domain/categories/use-cases/get-price/get-price-request.dto';
import { GetPriceResponseDto } from '@domain/categories/use-cases/get-price/get-price-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetPriceUseCase
  extends UseCase<GetPriceRequestDto>
  implements IUseCase<GetPriceRequestDto, GetPriceResponseDto | undefined>
{
  public async execute(
    request: GetPriceRequestDto
  ): Promise<Result<GetPriceResponseDto | undefined, Error>> {
    await this.validateDto(GetPriceRequestDto, request);

    const price = await CategoriesCollection.findOneAsync({
      code: request.category,
    });

    if (!price) {
      return err(new PriceNotFoundError());
    }

    return ok<GetPriceResponseDto>({
      _id: price._id,
      amount: price.amount,
      category: price.code,
    });
  }
}
