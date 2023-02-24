import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { CategoriesCollection } from '@domain/categories/categories.collection';
import { PriceNotFoundError } from '@domain/categories/errors/price-not-found.error';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { Logger } from '@infra/logger/logger.service';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class UpdateCategoryUseCase
  extends UseCase<UpdateCategoryRequestDto>
  implements IUseCase<UpdateCategoryRequestDto, undefined>
{
  public constructor(private readonly _logger: Logger) {
    super();
  }

  public async execute(
    request: UpdateCategoryRequestDto
  ): Promise<Result<undefined, Error>> {
    await this.validateDto(UpdateCategoryRequestDto, request);

    const price = await CategoriesCollection.findOneAsync({
      code: request.category,
    });

    if (!price) {
      return err(new PriceNotFoundError());
    }

    price.amount = request.amount;

    await CategoriesCollection.updateEntity(price);

    this._logger.info('Price updated', { category: request.category });

    return ok(undefined);
  }
}
