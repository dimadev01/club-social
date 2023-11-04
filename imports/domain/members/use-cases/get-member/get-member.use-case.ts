import { ok, Result } from 'neverthrow';
import { injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { MembersCollection } from '@domain/members/member.collection';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberResponseDto } from '@domain/members/use-cases/get-member/get-member-response.dto';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMemberUseCase
  extends UseCase<GetMemberRequestDto>
  implements IUseCase<GetMemberRequestDto, GetMemberResponseDto | null>
{
  public async execute(
    request: GetMemberRequestDto
  ): Promise<Result<GetMemberResponseDto | null, Error>> {
    await this.validateDto(GetMemberRequestDto, request);

    const member = await MembersCollection.findOneAsync(request.id);

    if (!member) {
      return ok(null);
    }

    member.joinUser();

    return ok<GetMemberResponseDto>({
      _id: member._id,
      addressCityGovId: member.address.cityGovId,
      addressCityName: member.address.cityName,
      addressStateGovId: member.address.stateGovId,
      addressStateName: member.address.stateName,
      addressStreet: member.address.street,
      addressZipCode: member.address.zipCode,
      category: member.category,
      dateOfBirth: member.dateOfBirth,
      documentID: member.documentID,
      emails: member.user.emails?.map((email) => email.address) ?? null,
      fileStatus: member.fileStatus,
      // @ts-expect-error
      firstName: member.user.profile?.firstName,
      // @ts-expect-error
      lastName: member.user.profile?.lastName,
      maritalStatus: member.maritalStatus,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
      userId: member.userId,
    });
  }
}
