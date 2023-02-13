import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { Member } from '@domain/members/member.entity';
import { MembersCollection } from '@domain/members/members.collection';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMemberUseCase
  extends UseCase<GetMemberRequestDto>
  implements IUseCase<GetMemberRequestDto, Member | undefined>
{
  public async execute(
    request: GetMemberRequestDto
  ): Promise<Result<Member | undefined, Error>> {
    await this.validateDto(GetMemberRequestDto, request);

    return ok(await MembersCollection.findOneAsync(request.id));
  }
}
