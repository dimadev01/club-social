import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { GetMembersGridResponse } from '@application/members/use-cases/ger-members-grid/get-members-grid.response';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindPaginatedMembersRequest,
  IMemberRepository,
} from '@domain/members/member.repository';

@injectable()
export class GetMembersGridUseCase
  implements IUseCase<FindPaginatedMembersRequest, GetMembersGridResponse>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: FindPaginatedMembersRequest,
  ): Promise<Result<GetMembersGridResponse, Error>> {
    const { items, totalCount, totals } =
      await this._memberRepository.findPaginated(request);

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok({
      items: items.map<MemberGridDto>((member) => {
        const balance = balances.find((b) => b._id === member._id);

        invariant(balance);

        return {
          category: member.category,
          id: member._id,
          name: member.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: member.status,
        };
      }),
      totalCount,
      totals,
    });
  }
}
