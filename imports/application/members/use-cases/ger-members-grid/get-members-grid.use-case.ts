import { Result, ok } from 'neverthrow';
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
    const { items, totalCount } =
      await this._memberRepository.findPaginated(request);

    return ok({
      items: items.map<MemberGridDto>((paginatedMember) => ({
        category: paginatedMember.member.category,
        id: paginatedMember.member._id,
        name: paginatedMember.member.nameLastFirst,
        pendingElectricity: paginatedMember.pendingElectricity,
        pendingGuest: paginatedMember.pendingGuest,
        pendingMembership: paginatedMember.pendingMembership,
        pendingTotal: paginatedMember.pendingTotal,
        status: paginatedMember.member.status,
      })),
      totalCount,
    });
  }
}
