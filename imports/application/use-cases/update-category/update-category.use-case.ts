import { err, ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { CategoryNotFoundError } from '@application/errors/category-not-found.error';
import { UpdateCategoryRequestDto } from '@application/use-cases/update-category/update-category-request.dto';
import { LoggerOstrio } from '@infra/logger/logger-ostrio';
import { CategoriesCollection } from '@infra/mongo/collections/categories.collection';

@injectable()
export class UpdateCategoryUseCase
  extends UseCase<UpdateCategoryRequestDto>
  implements IUseCase<UpdateCategoryRequestDto, undefined>
{
  public constructor(private readonly _logger: LoggerOstrio) {
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
      return err(new CategoryNotFoundError());
    }

    price.amount = request.amount;

    await CategoriesCollection.updateEntity(price);

    this._logger.info('Price updated', { category: request.category });

    return ok(undefined);
  }
}
