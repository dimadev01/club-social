import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { GetMembersGridRequest } from '@application/members/use-cases/ger-members-grid/get-members-grid.request';
import { GetMembersGridResponse } from '@application/members/use-cases/ger-members-grid/get-members-grid.response';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/repositories/member.repository';

@injectable()
export class GetMembersGridUseCase
  implements IUseCase<GetMembersGridRequest, GetMembersGridResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: GetMembersGridRequest,
  ): Promise<Result<GetMembersGridResponse, Error>> {
    const { items, totalCount, totals } =
      await this._memberRepository.findPaginated(request);

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok({
      balances,
      items,
      totalCount,
      totals,
    });
  }
}
