import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { IMemberCreditRepository } from '@application/members/repositories/member-credit.repository';
import { GetMemberAvailableCreditResponse } from '@application/members/use-cases/get-member-available-credit/get-member-available-credit.response';

@injectable()
export class GetMemberAvailableCreditUseCase
  implements IUseCase<FindOneById, GetMemberAvailableCreditResponse>
{
  public constructor(
    @inject(DIToken.IMemberCreditRepository)
    private readonly _memberCreditRepository: IMemberCreditRepository,
  ) {}

  public async execute(
    request: FindOneById,
  ): Promise<Result<GetMemberAvailableCreditResponse, Error>> {
    const amount = await this._memberCreditRepository.getAvailable(request.id);

    return ok(amount);
  }
}
