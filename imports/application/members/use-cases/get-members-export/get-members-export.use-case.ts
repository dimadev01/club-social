import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { IUseCase } from '@application/common/use-case.interface';
import { MemberGridDto } from '@application/members/dtos/member-grid.dto';
import {
  FindPaginatedMembersRequest,
  IMemberRepository,
} from '@application/members/repositories/member.repository';

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

    return ok<MemberGridDto[]>(
      members.map<MemberGridDto>((paginatedMember) => ({
        category: paginatedMember.member.category,
        email: paginatedMember.member.hasEmail()
          ? paginatedMember.member.firstEmail()
          : null,
        id: paginatedMember.member._id,
        name: paginatedMember.member.name,
        pendingElectricity: paginatedMember.pendingElectricity,
        pendingGuest: paginatedMember.pendingGuest,
        pendingMembership: paginatedMember.pendingMembership,
        pendingTotal: paginatedMember.pendingTotal,
        status: paginatedMember.member.status,
      })),
    );
  }
}
