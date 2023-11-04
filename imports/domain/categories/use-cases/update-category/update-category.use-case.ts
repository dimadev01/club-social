import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { ILogger } from '@application/logger/logger.interface';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';
import { CurrencyUtils } from '@shared/utils/currency.utils';

@injectable()
export class UpdateCategoryUseCase
  extends UseCase<UpdateCategoryRequestDto>
  implements IUseCase<UpdateCategoryRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger) private readonly _logger: ILogger,
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort
  ) {
    super();
  }

  public async execute(
    request: UpdateCategoryRequestDto
  ): Promise<Result<null, Error>> {
    const category = await this._categoryPort.findOneByIdOrThrow(request.id);

    if (request.amount) {
      category.updatePrice(CurrencyUtils.toCents(request.amount));
    } else {
      category.updatePrice(null);
    }

    await this._categoryPort.update(category);

    this._logger.info('Category updated', { category: category._id });

    return ok(null);
  }
}
