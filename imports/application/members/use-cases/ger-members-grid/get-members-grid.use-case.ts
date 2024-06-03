import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
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

    return ok<GetMembersGridResponse>({
      items: items.map<MemberGridDto>((item) => {
        const balance = balances.find((b) => b._id === item._id);

        invariant(balance);

        invariant(item.user);

        return {
          category: item.category,
          id: item._id,
          name: item.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: item.status,
        };
      }),
      totalCount,
      totals,
    });
  }
}
