import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import {
  FindPaginatedMembersRequest,
  IMemberRepository,
} from '@application/members/repositories/member.repository';
import { GetMembersGridResponse } from '@application/members/use-cases/ger-members-grid/get-members-grid.response';

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
        availableCredit: paginatedMember.availableCredit,
        category: paginatedMember.member.category,
        email: paginatedMember.member.hasEmail()
          ? paginatedMember.member.firstEmail()
          : null,
        id: paginatedMember.member._id,
        name: paginatedMember.member.nameLastFirst,
        pendingElectricity: paginatedMember.pendingElectricity,
        pendingGuest: paginatedMember.pendingGuest,
        pendingMembership: paginatedMember.pendingMembership,
        pendingTotal: paginatedMember.pendingTotal,
        phones: '',
        status: paginatedMember.member.status,
      })),
      totalCount,
    });
  }
}
