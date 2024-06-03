import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetDueRequest } from '@application/dues/use-cases/get-due/get-due.request';
import { GetDueResponse } from '@application/dues/use-cases/get-due/get-due.response';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
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
    const due = await this._dueRepository.findOneById(request);

    if (!due) {
      return err(new ModelNotFoundError());
    }

    return ok<GetDueResponse>({
      amount: due.amount.amount,
      category: due.category,
      date: due.date.toISOString(),
      id: due._id,
      memberId: due.memberId,
      notes: due.notes,
      status: due.status,
    });
  }
}
