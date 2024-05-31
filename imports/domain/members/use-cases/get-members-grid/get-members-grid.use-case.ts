import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@domain/common/tokens.di';
import { IGridUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/member-repository.interface';
import {
  FindPaginatedMembersRequest,
  FindPaginatedMembersResponse,
} from '@domain/members/repositories/find-paginated-members.interface';
import { MemberGridModelDto } from '@domain/members/use-cases/get-members-grid/member-grid-model-dto';

@injectable()
export class GetMembersGridUseCase
  implements IGridUseCase<FindPaginatedMembersRequest, MemberGridModelDto>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: FindPaginatedMembersRequest,
  ): Promise<Result<FindPaginatedMembersResponse<MemberGridModelDto>, Error>> {
    const { items, totalCount, totals } =
      await this._memberRepository.findPaginated(request);

    const balances = await this._memberRepository.getBalances(
      items.map((item) => item._id),
    );

    return ok<FindPaginatedMembersResponse<MemberGridModelDto>>({
      items: items.map<MemberGridModelDto>((item) => {
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
      totals,
    });
  }
}
