import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindPaginatedDuesFilters,
  GetDuesTotalsResponse,
  IDueRepository,
} from '@domain/dues/due.repository';

@injectable()
export class GetDuesTotalUseCase
  implements IUseCase<FindPaginatedDuesFilters, GetDuesTotalsResponse>
{
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: FindPaginatedDuesFilters,
  ): Promise<Result<GetDuesTotalsResponse, Error>> {
    const result = await this.dueRepository.getTotals(request);

    return ok(result);
  }
}
