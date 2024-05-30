import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { FindPaginatedResponse } from '@domain/common/repositories/queryable-grid-repository.interface';
import { DIToken } from '@domain/common/tokens.di';
import { IGridUseCase } from '@domain/common/use-case.interface';
import {
  GetMembersGridRequest,
  IMemberRepository,
} from '@domain/members/member-repository.interface';
import { GetMemberGridResponse } from '@domain/members/use-cases/get-member/get-member-grid.response';

@injectable()
export class GetMembersGridUseCase
  implements IGridUseCase<GetMembersGridRequest, GetMemberGridResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: GetMembersGridRequest,
  ): Promise<Result<FindPaginatedResponse<GetMemberGridResponse>, Error>> {
    const { items, totalCount } =
      await this._memberRepository.findPaginated(request);

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok<FindPaginatedResponse<GetMemberGridResponse>>({
      items: items.map<GetMemberGridResponse>((item) => {
        const balance = balances.find((b) => b._id === item._id);

        invariant(balance);

        invariant(item.user);

        return {
          _id: item._id,
          category: item.category,
          name: item.user.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: item.status,
        };
      }),
      totalCount,
    });
  }
}
