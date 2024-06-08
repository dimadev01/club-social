import { Result, ok } from 'neverthrow';
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

    return ok<MemberGridDto[]>(
      members.map<MemberGridDto>((paginatedMember) => ({
        category: paginatedMember.member.category,
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
