import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetDuesGridRequest } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.request';
import { GetDuesGridResponse } from '@application/dues/use-cases/get-dues-grid/get-dues-grid.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetDuesGridUseCase
  implements IUseCase<GetDuesGridRequest, GetDuesGridResponse>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: GetDuesGridRequest,
  ): Promise<Result<GetDuesGridResponse, Error>> {
    const { items, totalCount } =
      await this._dueRepository.findPaginated(request);

    return ok({ items, totalCount });
  }
}
