import { ok, Result } from 'neverthrow';
import { inject, injectable } from 'tsyringe';
import { IUseCase } from '@application/use-cases/use-case.interface';
import { IMemberPort } from '@domain/members/member.port';
import { GetMemberRequestDto } from '@domain/members/use-cases/get-member/get-member-request.dto';
import { GetMemberResponseDto } from '@domain/members/use-cases/get-member/get-member-response.dto';
import { PermissionEnum, ScopeEnum } from '@domain/roles/role.enum';
import { DIToken } from '@infra/di/di-tokens';
import { UseCase } from '@infra/use-cases/use-case';

@injectable()
export class GetMemberUseCase
  extends UseCase<GetMemberRequestDto>
  implements IUseCase<GetMemberRequestDto, GetMemberResponseDto | null>
{
  public constructor(
    @inject(DIToken.MemberRepository)
    private readonly _memberPort: IMemberPort
  ) {
    super();
  }

  public async execute(
    request: GetMemberRequestDto
  ): Promise<Result<GetMemberResponseDto | null, Error>> {
    await this.validatePermission(ScopeEnum.Members, PermissionEnum.Read);

    const member = await this._memberPort.findOneById(request.id);

    if (!member) {
      return ok(null);
    }

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
      emails: member.user.emails?.map((email) => email.address) ?? [],
      fileStatus: member.fileStatus,
      firstName: member.firstName,
      lastName: member.lastName,
      maritalStatus: member.maritalStatus,
      name: member.name,
      nationality: member.nationality,
      phones: member.phones,
      sex: member.sex,
      status: member.status,
      userId: member.userId,
    });
  }
}
