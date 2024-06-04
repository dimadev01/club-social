import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetDuesByIdsRequest } from '@application/dues/use-cases/get-dues-by-ids/get-dues-by-ids.request';
import { GetDuesByIdsResponse } from '@application/dues/use-cases/get-dues-by-ids/get-dues-by-ids.response';
import { FindModelsByIds } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetDuesByIdsUseCase
  implements IUseCase<GetDuesByIdsRequest, GetDuesByIdsResponse>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: FindModelsByIds,
  ): Promise<Result<GetDuesByIdsResponse, Error>> {
    const dues = await this._dueRepository.findByIds(request);

    return ok(dues);
  }
}
