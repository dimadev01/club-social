import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetPendingDuesRequest } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.request';
import { GetPendingDuesResponse } from '@application/dues/use-cases/get-pending-dues/get-pending-dues.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetPendingDuesUseCase
  implements IUseCase<GetPendingDuesRequest, GetPendingDuesResponse>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: GetPendingDuesRequest,
  ): Promise<Result<GetPendingDuesResponse, Error>> {
    const dues = await this._dueRepository.findPending({
      memberId: request.memberId,
    });

    return ok(dues);
  }
}
