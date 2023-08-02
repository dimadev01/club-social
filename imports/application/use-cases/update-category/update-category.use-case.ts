import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { UseCase } from '@application/common/use-case.base';
import { IUseCase } from '@application/common/use-case.interfaces';
import { ILogger } from '@application/logger/logger.interface';
import { ICategoryRepository } from '@application/repositories/category-repository.interface';
import { UpdateCategoryRequestDto } from '@application/use-cases/update-category/update-category-request.dto';
import { Tokens } from '@infra/di/di-tokens';

@injectable()
export class UpdateCategoryUseCase
  extends UseCase<UpdateCategoryRequestDto>
  implements IUseCase<UpdateCategoryRequestDto, undefined>
{
  // #region Constructors (1)

  public constructor(
    @inject(Tokens.Logger) private readonly _logger: ILogger,
    @inject(Tokens.CategoryRepository)
    private readonly _categoryRepository: ICategoryRepository
  ) {
    super();
  }

  // #endregion Constructors (1)

  // #region Public Methods (1)

  public async execute(
    request: UpdateCategoryRequestDto
  ): Promise<Result<undefined, Error>> {
    const category = await this._categoryRepository.findByCodeOrThrow(
      request.category
    );

    category.updatePrice(request.amount);

    await this._categoryRepository.update(category);

    this._logger.info('Category updated', { category: request.category });

    return ok(undefined);
  }

  // #endregion Public Methods (1)
}
