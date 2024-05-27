import { Result, ok } from 'neverthrow';
import { inject, injectable } from 'tsyringe';

import { IUseCase } from '@application/use-cases/use-case.interface';
import { MemberModel } from '@domain/members/models/member.model';
import { UserMongoRepository } from '@domain/members/new/user.mongo-repository';
import { DIToken } from '@infra/di/di-tokens';
import { IMemberRepository } from '@infra/mongo/repositories/members/member-repository.interface';

@injectable()
export class GetMemberNewUseCase implements IUseCase<null, MemberModel | null> {
  public constructor(
    @inject(DIToken.IMemberRepository)
    private readonly _memberRepository: IMemberRepository,
    @inject(UserMongoRepository)
    private readonly _userMongoRepository: UserMongoRepository,
  ) {}

  public async execute(): Promise<Result<MemberModel | null, Error>> {
    const member =
      await this._memberRepository.findOneById('JuZ65fC3sCi6JqdNH');

    if (!member) {
      return ok(null);
    }

    member.user = await this._userMongoRepository.findOneById(member.userId);

    return ok(member);
  }
}
