import { Result, err, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { DIToken } from '@application/common/di/tokens.di';
import { FindOneById } from '@application/common/repositories/queryable.repository';
import { IUseCase } from '@application/common/use-case.interface';
import { MemberDto } from '@application/members/dtos/member.dto';
import { MemberDtoMapper } from '@application/members/mappers/member-dto.mapper';
import { IMemberRepository } from '@application/members/repositories/member.repository';
import { ModelNotFoundError } from '@domain/common/errors/model-not-found.error';

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
    const member = await this._memberRepository.findOneById(request);

    if (!member) {
      return err(new ModelNotFoundError());
    }

    return ok(this._memberDtoMapper.toDto(member));
  }
}
