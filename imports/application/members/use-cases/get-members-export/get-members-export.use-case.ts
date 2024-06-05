import { Result, ok } from 'neverthrow';
import invariant from 'tiny-invariant';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindPaginatedMembersRequest,
  IMemberRepository,
} from '@domain/members/member.repository';

@injectable()
export class GetMembersToExportUseCase
  implements IUseCase<FindPaginatedMembersRequest, MemberGridDto[]>
{
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
  ) {}

  public async execute(
    request: FindPaginatedMembersRequest,
  ): Promise<Result<MemberGridDto[], Error>> {
    const members = await this._memberRepository.findToExport(request);

    const balances = await this._memberRepository.getBalances(
      members.map((item) => item._id),
    );

    return ok<MemberGridDto[]>(
      members.map<MemberGridDto>((item) => {
        const balance = balances.find((b) => b._id === item._id);

        invariant(balance);

        invariant(item.user);

        return {
          category: item.category,
          id: item._id,
          name: item.user.name,
          pendingElectricity: balance.electricity,
          pendingGuest: balance.guest,
          pendingMembership: balance.membership,
          pendingTotal: balance.total,
          status: item.status,
        };
      }),
    );
  }
}
