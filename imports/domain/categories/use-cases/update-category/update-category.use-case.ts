import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ILogger } from '@application/logger/logger.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { Tokens } from '@infra/di/di-tokens';
import { CurrencyUtils } from '@shared/utils/currency.utils';

@injectable()
export class UpdateCategoryUseCase
  extends UseCase<UpdateCategoryRequestDto>
  implements IUseCase<UpdateCategoryRequestDto, undefined>
{
  // #region Constructors (1)

  public constructor(
    @inject(Tokens.Logger) private readonly _logger: ILogger,
    @inject(Tokens.CategoryRepository)
    private readonly _categoryRepository: ICategoryPort
  ) {
    super();
  }

  // #endregion Constructors (1)

  // #region Public Methods (1)

  public async execute(
    request: UpdateCategoryRequestDto
  ): Promise<Result<undefined, Error>> {
    const category = await this._categoryRepository.findOneByIdOrThrow(
      request.id
    );

    category.addHistorical();

    if (request.amount) {
      category.updatePrice(CurrencyUtils.toCents(request.amount));
    } else {
      category.updatePrice(null);
    }

    await this._categoryRepository.update(category);

    this._logger.info('Category updated', { category: category._id });

    return ok(undefined);
  }

  // #endregion Public Methods (1)
}
