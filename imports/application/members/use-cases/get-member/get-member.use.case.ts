import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { MemberDto } from '@application/members/dtos/member.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';
import { FindOneById } from '@domain/common/repositories/queryable.repository';
import { IUseCase } from '@domain/common/use-case.interface';
import { IMemberRepository } from '@domain/members/member.repository';

@injectable()
export class GetMemberUseCase implements IUseCase<FindOneById, MemberDto> {
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    private readonly _memberDtoMapper: MemberDtoMapper,
  ) {}

  public async execute(
    request: FindOneById,
  ): Promise<Result<MemberDto, Error>> {
    const member = await this._memberRepository.findOneById({
      fetchUser: true,
      id: request.id,
    });

    if (!member) {
      return err(new ModelNotFoundError());
    }

    return ok(this._memberDtoMapper.toDto(member));
  }
}
