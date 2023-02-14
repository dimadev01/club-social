import { Meteor } from 'meteor/meteor';
import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { MembersCollection } from '@domain/members/members.collection';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberResponseDto } from '@domain/members/use-cases/get-member/get-member-response.dto';
import { UseCase } from '@kernel/use-case.base';
import { IUseCase } from '@kernel/use-case.interface';

@injectable()
export class GetMemberUseCase
  extends UseCase<GetMemberRequestDto>
  implements IUseCase<GetMemberRequestDto, GetMemberResponseDto | undefined>
{
  public async execute(
    request: GetMemberRequestDto
  ): Promise<Result<GetMemberResponseDto | undefined, Error>> {
    await this.validateDto(GetMemberRequestDto, request);

    const member = await MembersCollection.findOneAsync(request.id);

    if (!member) {
      return ok(undefined);
    }

    const user = await Meteor.users.findOneAsync(member.userId);

    if (!user) {
      return ok(undefined);
    }

    return ok({
      _id: member._id,
      dateOfBirth: member.dateOfBirth,
      email: user.emails?.[0].address ?? '',
      // @ts-ignore
      firstName: user.profile?.firstName ?? '',
      // @ts-ignore
      lastName: user.profile?.lastName ?? '',
    });
  }
}
