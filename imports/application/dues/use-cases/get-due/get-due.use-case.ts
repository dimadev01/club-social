import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetDueRequest } from '@application/dues/use-cases/get-due/get-due.request';
import { GetDueResponse } from '@application/dues/use-cases/get-due/get-due.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IDueRepository } from '@domain/dues/due.repository';

@injectable()
export class GetDueUseCase implements IUseCase<GetDueRequest, GetDueResponse> {
  public constructor(
    @inject(DIToken.IDueRepository)
    private readonly _dueRepository: IDueRepository,
  ) {}

  public async execute(
    request: GetDueRequest,
  ): Promise<Result<GetDueResponse, Error>> {
    const due = await this._dueRepository.findOneById({
      fetchPaymentDues: true,
      id: request.id,
    });

    return ok(due);
  }
}
