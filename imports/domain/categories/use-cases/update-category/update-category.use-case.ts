import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { ILogger } from '@application/logger/logger.interface';
import { IUseCaseOld } from '@application/use-cases/use-case.interface';
import { ICategoryPort } from '@domain/categories/category.port';
import { UpdateCategoryRequestDto } from '@domain/categories/use-cases/update-category/update-category-request.dto';
import { DIToken } from '@domain/common/tokens.di';
import { UseCaseOld } from '@infra/use-cases/use-case';

@injectable()
export class UpdateCategoryUseCase
  extends UseCaseOld<UpdateCategoryRequestDto>
  implements IUseCaseOld<UpdateCategoryRequestDto, null>
{
  public constructor(
    @inject(DIToken.Logger)
    private readonly _logger: ILogger,
    @inject(DIToken.CategoryRepository)
    private readonly _categoryPort: ICategoryPort,
  ) {
    super();
  }

  public async execute(
    request: UpdateCategoryRequestDto,
  ): Promise<Result<null, Error>> {
    const category = await this._categoryPort.findOneByIdOrThrow(request.id);

    const updateResult = Result.combine([category.updatePrice(request.amount)]);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    await this._categoryPort.update(category);

    this._logger.info('Category updated', { category: category._id });

    return ok(null);
  }
}
