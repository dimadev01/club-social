import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberDto } from '@application/members/dtos/member.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { IUseCase } from '@domain/common/use-case.interface';
import {
  FindMembers,
  IMemberRepository,
} from '@domain/members/member.repository';

@injectable()
export class GetMembersUseCase implements IUseCase<FindMembers, MemberDto[]> {
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    private readonly _memberDtoMapper: MemberDtoMapper,
  ) {}

  public async execute(
    request: FindMembers,
  ): Promise<Result<MemberDto[], Error>> {
    const members = await this._memberRepository.find({
      category: request.category,
      status: request.status,
    });

    return ok(members.map((member) => this._memberDtoMapper.toDto(member)));
  }
}
